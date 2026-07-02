const bookElement = document.getElementById("book");

const pageIndicator = document.getElementById("pageIndicator");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");

const fullscreenBtn = document.getElementById("fullscreen");

let zoom = 1;

const pageFlip = new St.PageFlip(bookElement, {

    width: 700,
    height: 990,

    size: "stretch",

    autoSize: true,

    usePortrait: true,

    showCover: true,

    mobileScrollSupport: true,

    startPage: 0,

    maxShadowOpacity: 0.45,

    drawShadow: true,

    flippingTime: 650,

    minWidth: 320,
    maxWidth: 1200,

    minHeight: 450,
    maxHeight: 1700

});

const TOTAL_PAGES = 32; // coloque aqui a quantidade real de páginas

const pages = [];

for (let i = 1; i <= TOTAL_PAGES; i++) {

    const number = String(i).padStart(3, "0");

    const page = document.createElement("div");
    page.className = "page";

    const img = document.createElement("img");
    img.src = `pages/page_${number}.jpg`;

    page.appendChild(img);

    pages.push(page);

}

pages.forEach(page => {
    bookElement.appendChild(page);
});

pageFlip.loadFromHTML(document.querySelectorAll(".page"));

}

pageFlip.loadFromHTML(pages);

function updateIndicator(){

    const current = pageFlip.getCurrentPageIndex() + 1;

    const total = pageFlip.getPageCount();

    pageIndicator.innerHTML =
        `Página ${current} / ${total}`;

}

pageFlip.on("flip", updateIndicator);

pageFlip.on("init", updateIndicator);

prevBtn.onclick = () => {

    pageFlip.flipPrev();

};

nextBtn.onclick = () => {

    pageFlip.flipNext();

};

document.addEventListener("keydown", e => {

    if(e.key==="ArrowLeft"){

        pageFlip.flipPrev();

    }

    if(e.key==="ArrowRight"){

        pageFlip.flipNext();

    }

});

zoomIn.onclick = () => {

    zoom += 0.10;

    if(zoom>2){

        zoom=2;

    }

    bookElement.style.transform=`scale(${zoom})`;

};

zoomOut.onclick = () => {

    zoom -=0.10;

    if(zoom<0.6){

        zoom=0.6;

    }

    bookElement.style.transform=`scale(${zoom})`;

};

fullscreenBtn.onclick=()=>{

    if(!document.fullscreenElement){

        document.documentElement.requestFullscreen();

    }else{

        document.exitFullscreen();

    }

};

function resizeBook() {

    if (window.innerWidth < 768) {

        bookElement.style.width = "96vw";
        bookElement.style.height = "84vh";

    } else {

        bookElement.style.width = "96vw";
        bookElement.style.height = "92vh";

    }

}

window.addEventListener("resize", resizeBook);

resizeBook();
updateIndicator();
