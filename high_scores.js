scoreList = [
  ["2021/01/17", "3:41"],
  ["2021/01/21", "4:01"],
  ["2021/02/01", "2:52"],
  ["2021/02/17", "3:08"],
  ["2021/03/02", "2:51"]
]

for (let i = 0; i < scoreList.length; i++){
  row = document.createElement('tr');
  document.getElementById("scores").appendChild(row);
  cell = document.createElement('td');
  cell.innerHTML = scoreList[i][0];
  row.appendChild(cell);
  cell = document.createElement('td');
  cell.innerHTML = scoreList[i][1];
  row.appendChild(cell);
}