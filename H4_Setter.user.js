// ==UserScript==
// @name        H4 Setter ⭐
// @namespace        http://tampermonkey.net/
// @version        0.3
// @description        ブログ編集画面で任意のdiv要素を「h4」に変更する
// @author        Ameba Blog User
// @match        https://blog.ameba.jp/ucs/entry/srventryinsertinput.do*
// @match        https://blog.ameba.jp/ucs/entry/srventryupdateinput.do*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameba.jp
// @grant        none
// @updateURL        https://github.com/personwritep/DH_Setter/raw/main/H4_Setter.user.js
// @downloadURL        https://github.com/personwritep/DH_Setter/raw/main/H4_Setter.user.js
// ==/UserScript==


let listen=Symbol();


let retry=0;
let interval=setInterval(wait_target, 20);
function wait_target(){
    retry++;
    if(retry>100){ // リトライ制限 100回 2sec
        clearInterval(interval); }
    let target=document.getElementById('cke_1_contents'); // 監視 target
    if(target){
        clearInterval(interval);
        main(target); }}


function main(target){

    let monitor=new MutationObserver(set_elem);
    monitor.observe(target, {childList: true});

    set_elem();

    function set_elem(){
        let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
        if(editor_iframe){ // iframe読込みが実行条件
            let iframe_doc=editor_iframe.contentWindow.document;
            if(iframe_doc){
                let hset=
                    '<style class="hset">'+
                    'h4::before { content: "H4▶"; position: absolute; left: -40px; color:red; '+
                    'font: bold 16px Meiryo; }'+
                    '</style>';
                if(!iframe_doc.querySelector('.hset')){
                    iframe_doc.documentElement.insertAdjacentHTML('beforeend', hset); }


                if(!iframe_doc[listen]){
                    iframe_doc.addEventListener('click', set_h4);
                    iframe_doc[listen]=true; }

                function set_h4(){
                    if(event.ctrlKey){
                        let elem=iframe_doc.elementFromPoint(event.clientX, event.clientY);
                        let div_elem=elem.closest('div');
                        if(div_elem.parentElement==iframe_doc.body){
                            if(!div_elem.querySelector('a')){ // リンクカードを除外
                                let outer=div_elem.outerHTML;
                                let regexp_s=/<div/;
                                let regexp_e=/<\/div>$/;
                                let new_s=outer.replace(regexp_s, '<h4');
                                let new_e=new_s.replace(regexp_e, '</h4>');
                                div_elem.outerHTML=new_e; }}}

                } // set_h4()

            }}} // set_elem()

} // main()
