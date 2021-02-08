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
    [Arguments]     ${username}  ${password}
    Open Chrome
    Click Element   id:login
    Wait Until Page Contains Element  id:username
    Input Text  id:username     ${username}
    Input Text  id:password     ${password}
    Click Element   css:form > #login
    Wait Until Page Contains Element  id:logout  10

Logout
    Click Element  id:logout

Join Station
    [Arguments]     ${station}
    Go To   http://localhost:3000/s/${station}
    Wait Until Page Contains Element  id:join-button
    Click Element   id:join-button

Leave Station
    [Arguments]     ${station}
    Go To   http://localhost:3000/s/${station}
    Wait Until Page Contains Element  id:leave-button
    Click Element   id:leave-button

Open Post
    Go To  http://localhost:3000/s/SampleStation/post/paaaaaaaaa14

Join Station and Open Post
    [Arguments]     ${station}
    Join Station  ${station}
    Open Post

Reset
    Go to  http://localhost:3000
