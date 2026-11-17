// ==UserScript==
// @name        DH Setter ⭐
// @namespace        http://tampermonkey.net/
// @version        0.3
// @description        ブログ編集画面で任意のdiv要素を「h4」に変更する
// @author        Ameba Blog User
// @match        https://blog.ameba.jp/ucs/entry/srventryinsertinput.do*
// @match        https://blog.ameba.jp/ucs/entry/srventryupdateinput.do*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameba.jp
// @grant        none
// @updateURL        https://github.com/personwritep/H4_Setter/raw/main/H4_Setter.user.js
// @downloadURL        https://github.com/personwritep/H4_Setter/raw/main/H4_Setter.user.js
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
                    '<style class="hsat">h2::before { content: "h2"; position: absolute; left: -36px; '+
                    'padding: 2px 4px 0; height: 18px; font: bold 16px/19px Meiryo; '+
                    'border: 1px solid #aaa; background: #fff; color: red; } '+
                    'h3::before { content: "h3"; position: absolute; left: -36px; '+
                    'padding: 2px 4px 0; height: 18px; font: bold 16px/19px Meiryo; '+
                    'border: 1px solid #aaa; background: #fff; color: #000; } '+
                    'h4::before { content: "h4"; position: absolute; left: -36px; '+
                    'padding: 2px 4px 0; height: 18px; font: bold 16px/19px Meiryo; '+
                    'border: 1px solid #aaa; background: #fff; color: #888; }</style>';

                if(!iframe_doc.querySelector('.hset')){
                    iframe_doc.documentElement.insertAdjacentHTML('beforeend', hset); }


                if(!iframe_doc[listen]){
                    iframe_doc.addEventListener('click', target_elem);
                    iframe_doc[listen]=true; }

                function target_elem(event){
                    if(event.ctrlKey){
                        let elem=event.target.closest(
                            '.cke_editable>div, .cke_editable>h4, .cke_editable>h3, .cke_editable>h2');
                        if(elem){
                            if(!elem.querySelector('a')){ // リンクカードを除外
                                rep_tag(elem); }}}

                } // target_elem()


                function rep_tag(element){
                    element.classList.add('replace');
                    let size_before=
                        window.getComputedStyle(element).getPropertyValue('font-size');
                    let outer_elem=element.outerHTML.toString();

                    if(witch_h(element)==2){
                        outer_elem=outer_elem.replace(/^<h2/, '<h3').replace(/h2>$/, 'h3>');
                        element.outerHTML=outer_elem;
                        safe_style(size_before); }
                    else if(witch_h(element)==3){
                        outer_elem=outer_elem.replace(/^<h3/, '<h4').replace(/h3>$/, 'h4>');
                        element.outerHTML=outer_elem;
                        safe_style(size_before); }
                    else if(witch_h(element)==4){
                        outer_elem=outer_elem.replace(/^<h4/, '<div').replace(/h4>$/, 'div>');
                        element.outerHTML=outer_elem;
                        safe_style(size_before); }
                    else if(witch_h(element)==0){
                        outer_elem=outer_elem.replace(/^<div/, '<h2').replace(/div>$/, 'h2>');
                        element.outerHTML=outer_elem;
                        safe_style(size_before); }

                } // rep_tag()　h2➔h3➔h4➔div➔h2 の書換


                function witch_h(elem){
                    if(elem.tagName=='H2'){
                        return 2; }
                    else if(elem.tagName=='H3'){
                        return 3; }
                    else if(elem.tagName=='H4'){
                        return 4; }
                    else return 0; }


                function safe_style(size_before){ // h要素の指による文字サイズ変化を抑止する
                    let new_element=iframe_doc.querySelector('.replace');
                    if(new_element){
                        new_element.classList.remove('replace');
                        if(size_before){
                            new_element.style.fontSize=size_before; }
                        else{
                            let iframe_body=iframe_doc.querySelector('.cke_editable');
                            let def_size=
                                window.getComputedStyle(iframe_body).getPropertyValue('font-size');
                            new_element.style.fontSize=def_size; }}

                } // safe_style()



            }}} // set_elem()

} // main()
