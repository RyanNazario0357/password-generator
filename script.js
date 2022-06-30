
function randomInt(min, max) {
  if (!max) {
    max = min
    min = 0
  }

  let rand = Math.random()
  return Math.floor(min * (1 - rand) + rand * max)
}

function getRandomIndex(list) {
  return list[randomInt(list.length)]
}

function promptUserForInputType(inputType, message, isValidCondition) {
  let userInput = window.prompt(message)
  let isValidType

  let inputObject = {
    canceled: userInput === null
  }

  if (inputType === "number") {
    userInput = parseInt(userInput)
    isValidType = !isNaN(userInput)
  }

  inputObject.isValidType = isValidType
  inputObject.value = userInput
  inputObject.isValidCondition = isValidType && isValidCondition(userInput)

  return inputObject
}

/* Constructors */

// create a new passwordOption object
function newPasswordOption(name, generator) {
  return {
    name: name,
    generate: generator,
  }
}

/* Password Generation */

function getRandomSymbol() {
  return String.fromCharCode(randomInt(33, 47))
}

function getRandomNumber() {
  return String.fromCharCode(randomInt(48, 57))
}

function getRandomLetterLower() {
  return String.fromCharCode(randomInt(97, 122))
}

function getRandomLetterUpper() {
  return getRandomLetterLower().toUpperCase()
}

function generatePassword(minLength, maxLength) {

  let passwordLengthResult

  while (true) {
    passwordLengthResult = promptUserForInputType(
      "number",
      "Enter a password length (between " + minLength + " and " + maxLength + " characters)",
      function(inputNumber) {
        return inputNumber >= minLength && inputNumber <= maxLength
      }
    )

    if (passwordLengthResult.canceled) return // user exited prompt

    if (!passwordLengthResult.isValidType) {
      window.alert("Please enter a valid number")

    } else if (!passwordLengthResult.isValidCondition) {
      window.alert("Password length must be between " + minLength + " and " + maxLength + " characters")

    } else {
      break
    }
  }

  let passwordOptions = [
    newPasswordOption("uppercase letters", getRandomLetterUpper),
    newPasswordOption("lowercase letters", getRandomLetterLower),
    newPasswordOption("symbols", getRandomSymbol),
    newPasswordOption("numbers", getRandomNumber),
  ]

  let selectedPasswordOptions = []

  for (let i = 0; i < passwordOptions.length; i++) {
    let option = passwordOptions[i]
    let userConfirmed = window.confirm("Would you like to include " + option.name + " in your password? (Okay = Yes, Cancel = No)")

    if (userConfirmed) selectedPasswordOptions.push(option)
  }

  if (selectedPasswordOptions.length === 0) {
    let randomOption = getRandomIndex(passwordOptions)
    window.alert("No specifications were given. Generating password with: " + randomOption.name)
    selectedPasswordOptions.push(randomOption)
  }

  let passwordBuffer = ""
  for (let i = 0; i < passwordLengthResult.value; i++) {
    passwordBuffer += getRandomIndex(selectedPasswordOptions).generate()
  }

  return passwordBuffer
}

function writePassword() {
  let password = generatePassword(8, 128);
  let passwordText = document.querySelector("#password");

  if (password) passwordText.value = password;
}

let generateBtn = document.querySelector("#generate");

generateBtn.addEventListener("click", writePassword);
