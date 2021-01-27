*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup     Open Chrome and Login   username=crewmate   password=password
Test Setup      Go To   http://localhost:3000/s/SampleStation/post/paaaaaaaaa10
*** Variables ***

*** Test Cases ***
14.1 Post like and unlike
    Wait Until Element is Visible   css:.score
    Wait Until Element Contains  css:.score  0
    Click Element   css:.upvote > img
    Wait Until Element Contains  css:.score  1
    Click Element   css:.upvoted
    Wait Until Element Contains  css:.score  0

14.2 Post dislike and undislike
    Wait Until Element is Visible   css:.score
    Wait Until Element Contains  css:.score  0
    Click Element   css:.downvote > img
    Wait Until Element Contains  css:.score  -1
    Click Element   css:.downvoted
    Wait Until Element Contains  css:.score  0
*** Keywords ***
