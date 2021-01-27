*** Settings ***
Library  SeleniumLibrary

*** Keywords ***
Open Chrome
    Open Browser  http://localhost:3000  headlesschrome
    Set Window Size  1980  720  true

Open Firefox
    Open Browser  http://localhost:3000  headlessfirefox
    Set Window Size  1980  720  true

Reset
    Go To  http://localhost:3000

Login
    Click Element   id:login
    Wait Until Page Contains Element  id:username
    Input Text  id:username  username
    Input Text  id:password  password
    Click Element   css:form > #login
    Wait Until Page Contains Element  id:logout

Logout
    Click Element  id:logout

Open Chrome and Login
    Open Chrome
    Login

Join Station
    Go To  http://localhost:3000/s/SampleStation
    Wait Until Page Contains Element  id:join-button
    Click Element   id:join-button

Leave Station
    Go To  http://localhost:3000/s/SampleStation
    Wait Until Page Contains Element  id:leave-button
    Click Element   id:leave-button

Open Post
    Go To  http://localhost:3000/s/SampleStation/post/paaaaaaaaa14

Join Station and Open Post
    Join Station
    Open Post
