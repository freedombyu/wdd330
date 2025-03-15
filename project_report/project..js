
document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const taskSource = document.getElementById('taskSource').value;
    const taskSite = document.getElementById('taskSite').value;
    
    const table = document.getElementById('taskTable');
    const row = table.insertRow();
    row.innerHTML = `<td>${taskName}</td><td><a href="${taskSource}" target="_blank">GitHub</a></td><td><a href="${taskSite}" target="_blank">Live Site</a></td>`;
    
    document.getElementById('taskForm').reset();
});

