// import type { PlasmoCSConfig } from "plasmo"

// export const config: PlasmoCSConfig = {
//   matches: ["https://www.plasmo.com/*"]
// }

// window.addEventListener("load", () => {
//   console.log(
//     "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
//   )

//   document.body.style.background = "pink"
// })

import cssText from "data-text:~/style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

export const config: PlasmoCSConfig = {
  matches: [
    "https://docs.google.com/document/*",
    "https://docs.google.com/spreadsheets/*",
    "https://docs.google.com/presentation/*",
    "https://docs.google.com/drawings/*"
  ]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

function selectRadioItem(radioGroup: Element, index: number) {
  const radioItems = radioGroup.querySelectorAll("[type='radio']")
  if (radioItems[index] as HTMLElement) {
    // console.log("Radio item found:", radioItems[index])
    ;(radioItems[index] as HTMLElement).click()
  }
}

function inputText(inputBox: Element, text: string) {
  if (inputBox) {
    ;(inputBox as HTMLTextAreaElement).focus()
    ;(inputBox as HTMLTextAreaElement).value = text
  }
}

function findRadioGroup(radioChoice: number) {
  const radioGroup = document.querySelector("[role='radiogroup']")
  if (radioGroup) {
    // console.log("Radio group found:", radioGroup)
    selectRadioItem(radioGroup, radioChoice)
  }
}

function findInputBox(message: string) {
  if (!message) return

  const inputBox = document.querySelector("textarea")
  if (inputBox) {
    // console.log("Input box found:", inputBox)
    inputText(inputBox, message)
  }
}

function findRequestAccessButton(isAllowAutoClickAndSubmit: boolean) {
  const button = document.querySelector("button")
  if (button) {
    // console.log("Request access button found:", button)
    if (isAllowAutoClickAndSubmit) {
      button.click()
    }
  }
}

const PlasmoOverlay = () => {
  const [insertMessage] = useStorage<string>("insert-message")
  const [insertRadioChoice] = useStorage<string>("insert-radio-choice")
  const [isAllowAutoClickAndSubmit] = useStorage<boolean>(
    "is-allow-auto-click-and-submit"
  )

  useEffect(() => {
    // console.log("Specific Google Document opened:", window.location.href)
    // console.log("Insert message:", insertMessage)
    // console.log("Insert radio choice:", insertRadioChoice)
    // console.log("Is allow auto click and submit:", isAllowAutoClickAndSubmit)

    if (
      insertMessage &&
      insertRadioChoice &&
      isAllowAutoClickAndSubmit != undefined
    ) {
      const numRadioChoice = Number(insertRadioChoice)
      findRadioGroup(numRadioChoice)
      findInputBox(insertMessage)
      findRequestAccessButton(isAllowAutoClickAndSubmit)
    }
  }, [insertMessage, insertRadioChoice, isAllowAutoClickAndSubmit])

  return (
    <div>
      <div className="block p-2 max-w-sm bg-white rounded-sm border border-gray-200 shadow-md">
        <p className="text-xs">Google Doc Access Request Detected</p>
        <p className="text-xs">Auto-filling form</p>
      </div>
    </div>
  )
}

// window.addEventListener("load", () => {
//   console.log("Specific Google Document opened:", window.location.href)
//   findRadioGroup()
//   findInputBox()
//   findRequestAccessButton()
// })

export default PlasmoOverlay
