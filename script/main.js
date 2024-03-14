const uploadForm = document.getElementById('upload-form');
const preview = document.getElementById('preview');

uploadForm.addEventListener('submit', event => {
    event.preventDefault();
    
    const request = {
        url: uploadForm.getAttribute('action'),
        method: uploadForm.getAttribute('method')
    };
    const body = new FormData(event.target);

    fetch(request.url, { method: request.method, body })
    .then(res => {
        return res.json();
    })
    .then(json => {
        preview.setAttribute('src', json.path);
    });
})