*** Settings ***
Library  SeleniumLibrary
Resource  ./Keywords/Common.robot
Suite Setup     Open Chrome and Login
*** Variables ***

*** Test Cases ***
10.1 Create Comment - Non-member
    Open Post
    Wait Until Page Contains Element  id:comment-text
    Input Text  id:comment-text  Hello!
    Click Element   id:post
    #Page Should Contain     Post title is required

10.21 Create Empty Comment - Non-member
    Open Post
    Reload Page
    Wait Until Page Contains Element  id:comment-text
    Click Element  id:post
    #Page Should Contain  Post text is required
    
10.22 Create Empty Comment - Member
    Join Station and Open Post
    Wait Until Page Contains Element  id:comment-text
    Click Element  id:post
    Leave Station
    #Page Should Contain     Post title is required

10.23 Create Comment - Member
    Join Station and Open Post
    Wait Until Page Contains Element  id:comment-text
    Input Text  id:comment-text  Comment Test Automation
    Click Element  id:post
    Reload Page
    Page Should Contain  Comment Test Automation

11.1 Create Subcomment - Member
    Click Element  xpath://html/body/div/div/div/div/div[2]/div/div[2]/div[1]/div[2]/div[3]/div[1]
    Input Text  class:subcomment-input  Subcomment Test Automation
    Click Element   class:send
    Reload Page
    Page Should Contain  Subcomment Test Automation
    #Page Should Contain Element  xpath://div>div[@class='']
    #Element Should Contain  
    #//span[@class='select-all' and text()='Uncheck All']
    #Page Should Contain     Post title is required

12.1 Edit Comment
    Click Element  xpath://html/body/div/div/div/div/div[2]/div/div[2]/div[1]/div[2]/div[3]/div[2]
    Input Text  class:w-100  Edited Comment
    Click Element  class:float-right
    Reload Page
    Page Should Contain  Edited Comment
    Page Should Not Contain  Comment Test Automation

12.2 Edit Subcomment
    Click Element  xpath://html/body/div/div/div/div/div[2]/div/div[2]/div[2]/div/div/div[2]/div[3]/div[2]
    Input Text  class:w-100  Edited Subcomment
    Click Element  class:float-right
    Reload Page
    Page Should Contain  Edited Subcomment
    Page Should Not Contain  Subcomment Test Automation

#11.1 Create Subcomment - Non-Member
    #[Setup]  Open Post
    #Wait Until Page Contains Element  id:comment-text
    #Input Text  id:text  Subcomment Test Automation
    #Click Element   id:post
    #Element Should Contain  
    #//span[@class='select-all' and text()='Uncheck All']
    #Page Should Contain     Post title is required
    #[Teardown]  Reload Page

13.1 Delete Comment
    Click Element  xpath://html/body/div/div/div/div/div[2]/div/div[2]/div[1]/div[2]/div[3]/div[3]
    Reload Page
    Page Should Not Contain  Edited Comment
    Page Should Contain  [deleted]

13.2 Delete Subcomment
    Click Element  xpath://html/body/div/div/div/div/div[2]/div/div[2]/div[2]/div/div/div[2]/div[3]/div[3]
    Reload Page
    Page Should Not Contain  Edited Subcomment
    Page Should Contain  [deleted]
    Leave Station
    
*** Keywords ***
