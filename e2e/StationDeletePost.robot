*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup     Open Chrome and Login
*** Variables ***

*** Test Cases ***
9.1 Post deletion canceled
    Go To   http://localhost:3000/s/SampleStation
    Wait Until Element Is Visible   css:.post:nth-child(1) .post-title
    Click Element   css:.post:nth-child(1) .post-title
    Wait Until Element Is Visible   id:__BVID__89__BV_toggle_
    Click Element   id:__BVID__89__BV_toggle_
    Wait Until Element Is Visible   id:delete-post-button
    Click Element   id:delete-post-button
    Wait Until Element Is Visible   css:.btn-secondary
    Click Element   css:.btn-secondary
    Page Should Contain Element     css:.post-title
    Page Should Contain     Sample Title 16
    Go To   http://localhost:3000/s/SampleStation
    Wait Until Page Contains     Sample Title 16

9.2 Post deletion confirmed
    Go To   http://localhost:3000/s/SampleStation
    Wait Until Element Is Visible  css:.post:nth-child(1) .post-title
    Click Element   css:.post:nth-child(1) .post-title
    Wait Until Element Is Visible  id:__BVID__89__BV_toggle_
    Click Element   id:__BVID__89__BV_toggle_
    Wait Until Element Is Visible  id:delete-post-button
    Click Element   id:delete-post-button
    Wait Until Element Is Visible  css:.btn-outline-danger
    Click Element   css:.btn-outline-danger
    Wait Until Page Contains     Post has successfully been deleted.
    Click Element   xpath://button[contains(.,'Return to /s/SampleStation')]
    Wait Until Page Does Not Contain    Sample Title 16
    Page Should Not Contain     Sample Title 16
*** Keywords ***
