// Minimal runtime for the portfolio templates: {{holes}}, <sc-if>, onClick bindings.
(function(){
  function esc(v){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function get(vals,expr){
    expr=expr.trim();
    if(expr==='true')return true; if(expr==='false')return false;
    return expr.split('.').reduce(function(o,k){return o==null?undefined:o[k];},vals);
  }
  window.DCLogic=function(props){this.props=props||{};this.state={};};
  DCLogic.prototype.setState=function(s){this.state=Object.assign({},this.state,s);DC.render(this);};
  window.DC={
    mount:function(C){var c=new C({});DC.inst=c;DC.render(c);if(location.hash){var t=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(t)setTimeout(function(){t.scrollIntoView();},50);}},
    render:function(c){
      var vals=c.renderVals(), tpl=document.getElementById('tpl').innerHTML, fns={}, n=0;
      var html=tpl.replace(/\son([a-zA-Z]+)="\{\{([^}]+)\}\}"/gi,function(m,ev,ex){var k='f'+(n++);fns[k]={ev:ev.toLowerCase(),fn:get(vals,ex)};return ' data-dcev="'+k+'"';})
        .replace(/\{\{([^}]+)\}\}/g,function(m,ex){var v=get(vals,ex);return v==null?'':esc(v);});
      var app=document.getElementById('app'), y=window.scrollY;
      var box=document.createElement('div'); box.innerHTML=html;
      var ifs; while((ifs=box.querySelectorAll('sc-if')).length){
        var el=ifs[0], v=el.getAttribute('value');
        if(v==='true'){while(el.firstChild)el.parentNode.insertBefore(el.firstChild,el);} el.remove();
      }
      box.querySelectorAll('[data-dcev]').forEach(function(el){var f=fns[el.getAttribute('data-dcev')];el.removeAttribute('data-dcev');if(typeof f.fn==='function')el.addEventListener(f.ev,f.fn);});
      app.replaceChildren.apply(app,Array.prototype.slice.call(box.childNodes));
      window.scrollTo(0,y);
    }
  };
})();
