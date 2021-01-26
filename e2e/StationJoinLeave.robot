*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup     Open Chrome and Login
Suite Teardown  Close Browser
*** Variables ***

*** Test Cases ***
5.1 Joining Station
    Go To   http://localhost:3000/s/SampleStation
    Wait Until Page Contains Element  id:join-button
    Click Element   id:join-button
    Wait Until Page Contains Element  id:leave-button
    Go To   http://localhost:3000/s/SampleStation
    Wait Until Page Contains Element  id:leave-button

5.2 Leaving Station
    Go To   http://localhost:3000/s/SampleStation
    Wait Until Page Contains Element  id:leave-button
    Click Element   id:leave-button
    Wait Until Page Contains Element  id:join-button
    Go To   http://localhost:3000/s/SampleStation
    Wait Until Page Contains Element  id:join-button
*** Keywords ***
