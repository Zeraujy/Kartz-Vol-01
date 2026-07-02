const bookElement = document.getElementById("book");

const pageIndicator = document.getElementById("pageIndicator");

const loadingOverlay = document.getElementById("loadingOverlay");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");

const fullscreenBtn = document.getElementById("fullscreen");

let zoom = 1;

// Nome do arquivo PDF, precisa estar na mesma pasta do index.html
const PDF_URL = "Kartz_Vol_01_by_Juarez.pdf";

// Resolução de renderização das páginas (quanto maior, mais nítido, porém mais pesado)
const RENDER_SCALE = 1.5;

// Quantas páginas renderizar antes de mostrar o livro (o resto carrega em segundo plano)
const INITIAL_BATCH = 4;

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function updateIndicator() {

    const current = pageFlip.getCurrentPageIndex() + 1;
    const total = pageFlip.getPageCount();

    pageIndicator.textContent = `Página ${current} de ${total}`;

}

function resizeBook() {

    if (window.innerWidth < 768) {

        bookElement.style.width = "96vw";
        bookElement.style.height = "84vh";

    } else {

        bookElement.style.width = "96vw";
        bookElement.style.height = "92vh";

    }

}

// já define o tamanho do #book antes do PageFlip medir o container,
// evitando que ele recalcule o layout (e "pule") durante o 1º flip
resizeBook();

const pageFlip = new St.PageFlip(bookElement, {

    width: 700,
    height: 990,

    size: "stretch",

    autoSize: true,

    usePortrait: false,

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

async function renderPage(pdf, pageNumber, totalPages) {

    const pdfPage = await pdf.getPage(pageNumber);

    const viewport = pdfPage.getViewport({ scale: RENDER_SCALE });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext("2d");

    await pdfPage.render({

        canvasContext: context,
        viewport: viewport

    }).promise;

    const page = document.createElement("div");
    page.className = pageNumber === 1 ? "page cover" : "page";
    page.dataset.pageNumber = pageNumber;

    if (pageNumber === 1 || pageNumber === totalPages) {
        page.setAttribute("data-density", "hard");
    }

    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/jpeg", 0.85);

    page.appendChild(img);

    return page;

}

async function renderPdfToPages(pdfUrl) {

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;

    const totalPages = pdf.numPages;

    const firstBatchCount = Math.min(INITIAL_BATCH, totalPages);

    // 1ª etapa: renderiza só o suficiente pra já mostrar o livro
    for (let i = 1; i <= firstBatchCount; i++) {

        const page = await renderPage(pdf, i, totalPages);
        bookElement.appendChild(page);

    }

    pageFlip.loadFromHTML(bookElement.querySelectorAll(".page"));

    pageFlip.on("flip", updateIndicator);

    pageFlip.on("init", updateIndicator);

    if (loadingOverlay) {
        loadingOverlay.style.display = "none";
    }

    setTimeout(() => {
        updateIndicator();
    }, 100);

    // 2ª etapa: renderiza o restante das páginas em segundo plano,
    // sem travar a leitura das primeiras páginas
    for (let i = firstBatchCount + 1; i <= totalPages; i++) {

        const page = await renderPage(pdf, i, totalPages);
        bookElement.appendChild(page);

        pageFlip.updateFromHtml(bookElement.querySelectorAll(".page"));

        updateIndicator();

    }

}

renderPdfToPages(PDF_URL).catch(err => {

    console.error("Erro ao carregar o PDF:", err);

    if (loadingOverlay) {
        loadingOverlay.textContent = "Erro ao carregar o livro. Verifique se o arquivo PDF está na pasta correta.";
    }

});

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

window.addEventListener("resize", resizeBook);
