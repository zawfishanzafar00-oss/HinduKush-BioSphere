/* Dropdown behavior for the compact Aurora-inspired main navigation. */
(()=>{
  const dropdowns=[...document.querySelectorAll('.nav-dropdown')];
  const closeAll=(except=null)=>dropdowns.forEach(item=>{
    if(item!==except){item.classList.remove('open');item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded','false');}
  });
  dropdowns.forEach(item=>{
    const toggle=item.querySelector('.nav-dropdown-toggle');
    toggle?.addEventListener('click',event=>{
      event.preventDefault();
      const willOpen=!item.classList.contains('open');
      closeAll(item);
      item.classList.toggle('open',willOpen);
      toggle.setAttribute('aria-expanded',String(willOpen));
    });
    item.querySelectorAll('.nav-dropdown-menu [data-view]').forEach(link=>{
      link.addEventListener('click',()=>closeAll());
    });
  });
  document.addEventListener('click',event=>{
    if(!event.target.closest('.nav-dropdown'))closeAll();
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')closeAll();
  });
})();
