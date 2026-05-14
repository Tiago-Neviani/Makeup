var containerSlider = document.querySelector(".slide-wrapper");
var dots = document.querySelectorAll(".dots");
var slideAtual = 0;
var slideBackup = 0; 

function proximoSlide(par1){
  let largura = document.querySelector("#slideshow").offsetWidth;
  containerSlider.style.transform = `translateX(-${largura * par1}px)`;
  dots.forEach(item => item.className = "dots");
  dots[par1].className = "dots select-dot";
}

dots.forEach(item =>{
  item.addEventListener("click", function(){
    var pg = parseInt(item.getAttribute("id"));
    slideAtual = pg;
    slideBackup = pg;
    proximoSlide(pg);
  });
});

document.querySelectorAll('.seta').forEach(seta =>{
  seta.addEventListener("click",()=>{
    var direcao = seta.getAttribute('direcao');
    slideAtual = 'pausa';

    if (direcao == "frente"){
      slideBackup++;
      if(slideBackup > 3){
        slideBackup = 0;
      }
      proximoSlide(slideBackup);
    } else {
      slideBackup--;
      if(slideBackup < 0){
        slideBackup = 3;
      }
      proximoSlide(slideBackup);
    }
  });
});

document.querySelector("#slideshow").addEventListener("mouseenter",function(){
  slideAtual = "pausa";
});
document.querySelector("#slideshow").addEventListener("mouseleave", function(){
  slideAtual = slideBackup;
});

setInterval(()=>{
  if (slideAtual != "pausa"){
    slideAtual++;
    if(slideAtual > 3){
      slideAtual = 0;
    }
    proximoSlide(slideAtual);
    slideBackup = slideAtual;
  }
}, 4000);