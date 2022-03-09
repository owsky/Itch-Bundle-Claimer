// ==UserScript==
// @name         Itch.io auto claimer
// @namespace    https://owsky.github.io/
// @version      0.1
// @description  Sit back while the games move directly to your library
// @author       owsky
// @match        https://*.itch.io/*
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_deleteValue
// ==/UserScript==

;(async function () {
  "use strict"

  // retrieve instance of last page visited
  let currPage = await GM_getValue("currPage")
  if (!currPage) {
    currPage = 1
    await GM_setValue("currPage", "1")
  }
  console.log("currPage: " + currPage)

  // get query parameters
  const searchParams = new URLSearchParams(window.location.search)
  // and extract current page from URL
  const param = searchParams.get("page")

  // get first claimable game
  const btn = document.querySelector("button[value='claim']")

  // get the link to return to the bundle
  const backLink = document.querySelector(
    "a[href^='https://itch.io/bundle/download/']"
  )

  // check whether the currently opened page is the bundle's page
  const url = new URL(window.location)
  if (url.href.includes("itch.io/bundle/download")) {
    // check if the script should jump forward through the list
    if (param < currPage) {
      searchParams.set("page", `${currPage}`)
      window.location.search = searchParams.toString()
      // check if a claimable game is found
    } else if (btn) {
      console.log("Claiming a game")
      btn.click()
    } else if (!btn) {
      // get the next page button
      const nextPageBtn = document.querySelector(".next_page")
      // if the button is found increment the current page in storage and navigate to the next
      if (nextPageBtn) {
        const nextPage = parseInt(currPage) + 1
        await GM_setValue("currPage", nextPage.toString())
        console.log("Moving to next page")
        nextPageBtn.click()
        // the script is done, clean the storage
      } else {
        console.log("All done")
        GM_deleteValue("currPage")
      }
    }
    // if the back to the bundle link is found jump to the last visited page
  } else if (backLink) {
    console.log("Returning to bundle page")
    const backUrl = new URL(backLink.href)
    window.location.href = backUrl.href + "?page=" + `${currPage}`
  }
})()
