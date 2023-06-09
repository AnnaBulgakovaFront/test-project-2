document.addEventListener("DOMContentLoaded", (event) => {
    menuToggle();
    selectInit();
    inputFileAdd();
    rangeInputAdd();
});

function menuToggle() {
    let burger = document.querySelector('.js-burger');
    let menu = document.querySelector('.js-nav');
    let html = document.querySelector('html');

    burger.addEventListener('click', function() {
        if(this.classList.contains('burger--close')) {
            this.classList.remove('burger--close');
            menu.classList.remove('nav--open');
            html.classList.remove('fix');
        }
        else {
            menu.classList.add('nav--open');
            html.classList.add('fix');
            this.classList.add('burger--close');
        }
    });
}

function selectInit() {
    let selectList = document.querySelectorAll('.js-select');

    selectList.forEach(item => {
        const mySelects = customSelect(item);
    });
}

function inputFileAdd() {
    let inputs = document.querySelectorAll('.js-input-file');
    inputs.forEach(item => {
    let label = item.previousElementSibling;
    let labelVal = label.querySelector('.js-input-file-text').innerText;
  
        item.addEventListener('change', function (e) {
        let countFiles = '';
        if (this.files && this.files.length >= 1)
          countFiles = this.files.length;
  
        if (countFiles)
          label.querySelector('.js-input-file-text').innerText = 'Выбрано файлов: ' + countFiles;
        else
          label.querySelector('.js-input-file-text').innerText = labelVal;
      });
    });
}

function rangeInputAdd() {
    let slider = document.querySelectorAll(".js-range");
    slider.forEach(item => {
        let inputVal = item.querySelector(".js-range-input");
        let output = item.querySelector(".js-range-output");
        output.innerHTML = inputVal.value;
    
        inputVal.oninput = function() {
            output.innerHTML = this.value;
        }
    });
   
}