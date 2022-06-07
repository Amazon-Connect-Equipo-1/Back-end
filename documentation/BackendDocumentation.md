-[Index]

  -[1. Agent routes](#1-agentcontrollerts)
    -[1.1 Get agent profile](#11-get-agent-profile)
    -[1.2 Get agent's feedback](#12-get-agents-feedback)
    -[1.3 Accept agent's feedback](#13-accept-agents-feedback)
    -[1.4 Update agent's profile picture](#14-update-agents-profile-picture)
    -[1.5 Update agent's status](#15-update-agents-status)

  -[2. Authentication routes](#2-authenticationcontrollerts)
    -[2.1 Sign up an agent](#21-sign-up-an-agent)
    -[2.2 Sign up a manager](#22-sign-up-a-manager)
    -[2.3 Verify an account](#23-verify-an-account)
    -[2.4 Sign in the application](#24-sign-in-the-application)
    -[2.5 Sign out the application](#25-sign-out-the-application)
    -[2.6 Initialize a forgot password flow](#26-initialize-a-forgot-password-flow)
    -[2.7 Confirm a new password](#27-confirm-a-new-password)
    -[2.8 Use a refresh token](#28-use-a-refresh-token)
    -[2.9 Get active user's email](#29-get-active-users-email)
    -[2.10 Get all the user's signed in the application](#210-get-all-the-users-signed-in-the-application)

  -[3. Client routes](#3-clientcontrollerts)
    -[3.1 Register a client](#31-register-a-client)
    -[3.2 Log in a client](#32-log-in-a-client)

  -[4. Key-Click Recording routes](#4-keyclickcontrollerts)
    -[4.1 Add a keystroke done by an agent](#41-add-a-keystroke-done-by-an-agent)
    -[4.2 Add a click done by an agent](#42-add-a-click-done-by-an-agent)
    -[4.3 Delete all the files created by the controller](#43-delete-all-the-files-created-by-the-controller)

  -[5. Manager routes](#5-managercontrollerts)
    -[5.1 List all agents in the system and its attributes](#51-list-all-agents-in-the-system-and-its-attributes)
    -[5.2 Get agent profile](#52-get-agent-profile)
    -[5.3 Get manager profile](#53-get-manager-profile)
    -[5.4 Show a specific recording](#54-show-a-specific-recording)
    -[5.5 Show recordings of an agent](#55-show-recordings-of-an-agent)
    -[5.6 Show recordings filtered by tags](#56-show-recordings-filtered-by-tags)
    -[5.7 Show newest recordings](#57-show-newest-recordings)
    -[5.8 Show newest or oldest recordings](#58-show-newest-or-oldest-recordings)
    -[5.9 Post comments to an agent](#59-post-comments-to-an-agent)
    -[5.10 Update manager's profile picture](#510-update-managers-profile-picture)

  -[6. Third-Party-Services routes](#6-thirdpartyservicescontrollerts)
    -[6.1 Ask for a Thirs Party Service](#61-ask-for-a-thirs-party-service)
    -[6.2 Send Third Party Service via e-mail](#62-send-third-party-service-via-e-mail)

  -[7. User Configuration routes](#7-userconfigurationsts)
    -[7.1 Get user's configuration](#71-get-users-configuration)
    -[7.2 Update user's configuration](#72-update-users-configuration)

# 1. AgentController.ts
  ## 1.1 Get agent profile
  
  This route lets you get all the data of a specific agent.
  
  -**endpoint**: `/agent/agentProfile`
  -**method**: `POST`
  -**body**:
  ```json
  {
	"email": "name@server.com",
	"password": "MYP4sw4rd$",
	"name": "Rob",
	"last_name": "Mc Donalds",
	"birthdate": "1990-10-23"
  }
  ```

  ## 1.2 Get agent's feedback
  ## 1.3 Accept agent's feedback
  ## 1.4 Update agent's profile picture
  ## 1.5 Update agent's status

# 2. AuthenticationController.ts
  ## 2.1 Sign up an agent
  ## 2.2 Sign up a manager
  ## 2.3 Verify an account
  ## 2.4 Sign in the application
  ## 2.5 Sign out the application
  ## 2.6 Initialize a forgot password flow
  ## 2.7 Confirm a new password
  ## 2.8 Use a refresh token
  ## 2.9 Get active user's email
  ## 2.10 Get all the user's signed in the application

# 3. ClientController.ts
  ## 3.1 Register a client 
  ## 3.2 Log in a client

# 4. KeyClickController.ts
  ## 4.1 Add a keystroke done by an agent
  ## 4.2 Add a click done by an agent
  ## 4.3 Delete all the files created by the controller

# 5. ManagerController.ts
  ## 5.1 List all agents in the system and its attributes
  ## 5.2 Get agent profile
  ## 5.3 Get manager profile
  ## 5.4 Show a specific recording 
  ## 5.5 Show recordings of an agent
  ## 5.6 Show recordings filtered by tags
  ## 5.7 Show newest recordings
  ## 5.8 Show newest or oldest recordings
  ## 5.9 Post comments to an agent
  ## 5.10 Update manager's profile picture

# 6. ThirdPartyServicesController.ts
  ## 6.1 Ask for a Thirs Party Service
  ## 6.2 Send Third Party Service via e-mail

# 7. UserConfigurations.ts
  ## 7.1 Get user's configuration
  ## 7.2 Update user's configuration