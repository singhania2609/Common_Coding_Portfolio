document.getElementById('statsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const gfgUsername = document.getElementById('gfgUsername').value;
    const leetcodeUsername = document.getElementById('leetcodeUsername').value;
    const codeforcesUsername = document.getElementById('codeforcesUsername').value;
  
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const gfgApiUrl = `https://geeks-for-geeks-stats-api.vercel.app/?raw=y&userName=${gfgUsername}`;
    const leetcodeApiUrl = `https://leetcode-api-faisalshohag.vercel.app/${leetcodeUsername}`;
    const codeforcesApiUrl = `https://codeforces.com/api/user.info?handles=${codeforcesUsername}`;
  
    Promise.all([
      fetch(proxyUrl + gfgApiUrl).then(response => response.json()),
      fetch(leetcodeApiUrl).then(response => response.json()),
      fetch(codeforcesApiUrl).then(response => response.json())
    ])
    .then(([gfgData, leetcodeData, codeforcesData]) => {
      let outputHtml = '';
  
      if (gfgData.error) {
        outputHtml += `<div class="error">GFG Error: ${gfgData.error}</div>`;
      } else {
        outputHtml += `
          <h3>GeeksforGeeks User Stats</h3>
          <p>Username: ${gfgData.userName}</p>
          <p>School Problems Solved: ${gfgData.School}</p>
          <p>Basic Problems Solved: ${gfgData.Basic}</p>
          <p>Easy Problems Solved: ${gfgData.Easy}</p>
          <p>Medium Problems Solved: ${gfgData.Medium}</p>
          <p>Hard Problems Solved: ${gfgData.Hard}</p>
          <p>Total Problems Solved: ${gfgData.totalProblemsSolved}</p>
        `;
      }
  
      if (leetcodeData.error) {
        outputHtml += `<div class="error">LeetCode Error: ${leetcodeData.error}</div>`;
      } else {
        outputHtml += `
          <h3>LeetCode User Stats</h3>
          <p>Username: ${leetcodeUsername}</p>
          <p>Total Problems Solved: ${leetcodeData.totalSolved}</p>
          <p>Easy Problems Solved: ${leetcodeData.easySolved}</p>
          <p>Medium Problems Solved: ${leetcodeData.mediumSolved}</p>
          <p>Hard Problems Solved: ${leetcodeData.hardSolved}</p>
        `;
      }
  
      if (codeforcesData.status !== 'OK') {
        outputHtml += `<div class="error">Codeforces Error: User not found</div>`;
      } else {
        const user = codeforcesData.result[0];
        outputHtml += `
          <h3>Codeforces User Stats</h3>
          <p>Username: ${user.handle}</p>
          <p>Rating: ${user.rating}</p>
          <p>Max Rating: ${user.maxRating}</p>
          <p>Rank: ${user.rank}</p>
          <p>Max Rank: ${user.maxRank}</p>
        `;
      }
  
      const summaryUrl = `summary.html?gfgUsername=${gfgUsername}&leetcodeUsername=${leetcodeUsername}&codeforcesUsername=${codeforcesUsername}`;
      outputHtml += `<p><a href="${summaryUrl}" target="_blank">View Summary</a></p>`;
  
      document.getElementById('output').innerHTML = outputHtml;
      document.getElementById('output').style.display = 'block';
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('error').textContent = 'An error occurred. Please try again.';
      document.getElementById('output').style.display = 'none';
    });
  });