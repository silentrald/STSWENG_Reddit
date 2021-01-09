*** Settings ***
Library  SeleniumLibrary

*** Keywords ***
Open Chrome
    Open Browser  http://localhost:3000  headlesschrome
    Set Window Size  1980  720  true

Open Firefox
    Open Browser  http://localhost:3000  headlessfirefox
    Set Window Size  1980  720  true