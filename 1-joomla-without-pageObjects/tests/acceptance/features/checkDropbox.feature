Feature: Check dropbox extension

    As a user
    I want to login to my joomla account
    So that only I can access my account

    Scenario: Dropbox isnot installed
      Given the user has browsed to login page 
      And the user has entered username 'kiranadh' and password 'kiran1234'
      And the user has seen ' Control Panel' heading
      And the user has clicked on components
      And the user has seen ' Dropbox Manager' heading

      When the user creates a new dropbox folder as 'kiran-joomla'
      And the user saves and connects to dropbox
      And the user enters email "newuser1452@gmail.com" and password "kiran1234"
      And the user enters the received token in Dropbox Code and saves

      Then the user should see 'kiran-joomla' in folder name
      And the user should see "You are here:  DROPBOX" message

