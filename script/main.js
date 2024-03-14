console.log('hello');

const uploadForm = document.getElementById('upload-form');
console.log(uploadForm);
uploadForm.addEventListener('submit', event => {
    event.preventDefault();
    
    const request = {
        url: uploadForm.getAttribute('action'),
        method: uploadForm.getAttribute('method')
    };
    const body = new FormData(event.target);

    fetch(request.url, { method: request.method, body })
    .then(res => {
        console.log(res);
    });
})