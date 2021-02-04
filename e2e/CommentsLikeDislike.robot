*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup     Open Chrome and Login   username=crewmate   password=password
Test Setup      Go To   http://localhost:3000/s/SampleStation/post/paaaaaaaaaa1
*** Variables ***

*** Test Cases ***
14.1 Post like and unlike
    Wait Until Element is Visible   css:div:nth-child(1) > .comment:nth-child(3) > .comment-content .upvote > img
    Wait Until Element Contains  css:div:nth-child(1) > .comment:nth-child(3) > .comment-content .score      0
    Click Element   css:div:nth-child(1) > .comment:nth-child(3) > .comment-content .upvote > img
    Wait Until Element Contains  css:div:nth-child(1) > .comment:nth-child(3) > .comment-content .score     1
    Click Element   css:.comment:nth-child(3) > .comment-content .upvoted
    Wait Until Element Contains  css:div:nth-child(1) > .comment:nth-child(3) > .comment-content .score     0

14.2 Post dislike and undislike
    Wait Until Element is Visible   css:div:nth-child(1) > .comment:nth-child(3) > .comment-content .upvote > img
    Wait Until Element Contains  css:div:nth-child(1) > .comment:nth-child(3) > .comment-content .score      0
    Click Element   css:div:nth-child(1) > .comment:nth-child(3) > .comment-content .downvote > img
    Wait Until Element Contains  css:div:nth-child(1) > .comment:nth-child(3) > .comment-content .score     -1
    Click Element   css:.comment:nth-child(3) > .comment-content .downvoted
    Wait Until Element Contains  css:div:nth-child(1) > .comment:nth-child(3) > .comment-content .score     0
*** Keywords ***
