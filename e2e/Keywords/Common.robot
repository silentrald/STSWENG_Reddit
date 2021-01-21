*** Settings ***
Library  SeleniumLibrary

*** Keywords ***
Open Chrome
    Open Browser  http://localhost:3000  headlesschrome
    Set Window Size  1980  720  true

Open Firefox
    Open Browser  http://localhost:3000  headlessfirefox
    Set Window Size  1980  720  true

Open Chrome and Login
    Open Chrome
    Click Element   id:login
    Wait Until Page Contains Element  id:username
    Input Text  id:username  username
    Input Text  id:password  password
    Click Element   css:form > #login
    Wait Until Page Contains Element  id:logout

Join Station
    Go To   http://localhost:3000/s/SampleStation
    Click Element   id:join-button

Leave Station
    Go To   http://localhost:3000/s/SampleStation
    Click Element   id:leave-button