const update = document.getElementById('update-button')

update.addEventListener('click', _ => {
    fetch('/frases', {
        method: 'put', 
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
            nome: 'Darth Vadar',
            frase: 'I find you lack od faith disturbing.'
        })
    })
})