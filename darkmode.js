//theme-switch
let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
  Array.from(document.getElementsByClassName("box")).forEach(e => {
    e.classList.add('darkbox')
    e.classList.remove('box')
  })

  themeSwitch.getElementsByTagName("img")[0].src = "assets/night.svg"

  localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
  Array.from(document.getElementsByClassName("darkbox")).forEach(e => {
    e.classList.add('box')
    e.classList.remove('darkbox')
  })

  themeSwitch.getElementsByTagName("img")[0].src = "assets/day.svg"

  localStorage.setItem('darkmode', null)
}

if (darkmode === "active") enableDarkmode()

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem('darkmode')
  darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})