*** Settings ***
Library  SeleniumLibrary
Library  Selenium2Library
*** Variables ***

*** Test Cases ***
This is sample test case
    [documentation]  User Registration

    Open Browser  http://localhost:3000  headlesschrome
    Set Window Size  1980  720  true

    Click Element  id=signup

    Wait Until Element is Visible  id=username
    Input Text  id=username  JohnCena1
    Input Text  id=email  Johncena@gmail.com
    Input Text  id=password  Password1
    Input Text  id=cpassword  Password1
    Click Element  id=submit

    Wait Until Element is Visible  id=success
    Close Browser

*** Keywords ***
