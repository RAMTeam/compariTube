let key=""
let firstSearchUl=document.getElementById("first-search-ul")
let secondSearchUl=document.getElementById("second-search-ul")
let firstForm=document.getElementById("first-search-form")
let secondForm= document.getElementById("second-search-form")

firstForm.addEventListener("submit",function(e){getSearchResult(e,firstSearchUl)})
secondForm.addEventListener("submit",function(e){getSearchResult(e,secondSearchUl)})

// get a search list using the form keywords
function getSearchResult(event,targetUl){
    event.preventDefault(); 
    searchBar=event.target.querySelector('input[type=text]')
    if(searchBar.value!=''){
     fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchBar.value}&key=${key}`)
    .then(response=>response.json())
    .then(function(data){
        console.log(filterUniqeChannels(data.items))
       return filterUniqeChannels(data.items)})
    .then(function(data){displaySearchResult(data,targetUl)})
}
    else{
        let warning=document.createElement('li')
        warning.textContent='Please enter a search keyword'
        targetUl.textContent=""
        targetUl.appendChild(warning)
    }
}


function filterUniqeChannels(searchList){
    let unique={}
    let filtered=searchList.filter(item=>!unique[item.snippet.title] && (unique[item.snippet.title] = true))
    return filtered
}

function displaySearchResult(searchList,targetUl){
    console.log(searchList)
    targetUl.textContent=""
    for(item of searchList){
        let li=document.createElement('li')

        let img=document.createElement('img')
        img.src=item.snippet.thumbnails.default.url
        
        let name=document.createElement('h3')
        name.textContent=item.snippet.channelTitle

        li.appendChild(img)
        li.appendChild(name)
        targetUl.appendChild(li)
    }    
}
