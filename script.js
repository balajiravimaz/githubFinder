const APIURL = "https://api.github.com/users/";

const inp = document.getElementById("search");
const load = document.querySelector(".lds-ellipsis");

async function getUser(url, name) {
    const res = await fetch(url + name);
    const data = await res.json();
    if (document.querySelector(".card")) {
        document.querySelector(".card").remove();
    }
    console.log(data);

    generateCard(data);
}

async function getRepos(url,name){
    const res = await fetch(url + name + "/repos");
    const data = await res.json();
    addRepos(data);    
}

function generateCard(data) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
    <div class="img">
        <img src="${data.avatar_url}" alt="${data.name}">
    </div>
    <div class="details">
        <h4>${data.name}</h4>
        <p>${data.bio}</p>        
        <div class="flex">
        <span>${data.followers} followers</span>
        <span>${data.following} following</span>
        <span>${data.public_repos} repos</span>
        </div>
        <h4 class="mt-1">Repos: </h4>
        <div class="flex" id="repo">
        </div>            
    </div>`;
    document.body.append(div);
}

function addRepos(reps) {
    const repoEl = document.getElementById("repo");    
    console.log(reps);
    
    reps.sort((a,b) => a.stargazers_count - b.stargazers_count)
    .slice(0,10)
    .forEach(list => {
        const a = document.createElement("a");
        a.className = "repos";
        a.setAttribute("href", list.html_url);
        a.innerText = list.name;
        
        repoEl.append(a);
    })
}

const liveSearch = updateLive(txt => {
    load.classList.add("active");
    getUser(APIURL, txt);
    getRepos(APIURL, txt);
    inp.value = "";
})

inp.addEventListener("input", (e) => {
    const { value } = e.target;
    if (value !== "") {
        load.classList.remove("active");
        liveSearch(value);
    }

})

function updateLive(cb, delay = 1000) {
    let timeout;
    return (...data) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...data)
        }, delay);
    }
}