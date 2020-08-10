
document.getElementById("day").addEventListener("click", day);
document.getElementById("night").addEventListener("click", night);


function day(){
    theme.className='day';
    localStorage.setItem('theme','day');
}
function night(){
    theme.className='night';
    localStorage.setItem('theme','night');
}
let selectedTheme = localStorage.getItem("theme");
    switch(selectedTheme){
    case 'day':{day()}
    break;
    case 'night':{night()}
    break;
    }

/*
document.getElementById("day").addEventListener("click", setLight);
document.getElementById("night").addEventListener("click", setDark);

function setLight(){
    document.getElementById("mainContainer").className ='light';
    localStorage.setItem('theme','light');
}
function setDark(){
    document.getElementById("mainContainer").className ='dark';
    localStorage.setItem ('theme','dark');
}
let selectedTheme = localStorage.getItem("theme")
switch(selectedTheme){
    case 'light':{setLight()}
    break;
    case 'dark':{setDark()}
    break;
}


*/
   