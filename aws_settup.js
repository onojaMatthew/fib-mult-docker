// =======================================================================================
/**
 * Setting up environment for deploying to AWS Elasticbean Stalk
 */

 // Navigate to aws.amazon.com
 // Search for elasticbeanstalk under services and select it
 // On elasticbeanstalk dashboard, click on Create New Application
 // Provide a name for your application environment in the dialogue box that will pop up and hit Create
 // on the next page, click on Create One Now
 // Select Web Server Environment on the new page and hit Select
 // Scroll to Base configuration on the next page and select Mult-container Docker under Preconfigured platform
 // Ensure Sample application is checked under Application code
 // Scroll down and click Create Environment
 //

 /**
  * Setting up RDS
  */

  // Go to services and type rds
  // Scroll down to the page and select Create Database
  // On the new page select the type of database your want to create
  // Note: The database you select should be the same as the one you've configured in your application
  // On this same page look for free tier and select it if you just want a test application else select production
  // Db instance Size select db.t2.micro which is the default if you have selected free tier earlier else you may select another option
  // Under Settings set the master username, master password and DB Instance Identifier
  // Under Connectivity or Network and Security:
  // Public accessibility should set to No because we don't want outside services to access our database aside the services we have in the application
  // Still under Connectivity, select Create new VPC security group
  // Provide a security group name in the input field
  // Under database option, provide a name for your database
  // click select window under backup
  // Finally, click Create database at the bottom of the page
const awsrdsdata = {
  "db-master-username": "postgres",
  "db-master-password": "mypostgrespassword",
  "database-name": "fibvalues",
}

// How to create AWS Elastic Cache for Redis

// Go to services and type elastic cache and select it
// Select Redis on the sidebar and click CREATE on the new page
// Ensure redis is checked on the next page then select CLUSTER MODE ENABLED if you need a cluster else leave it unchecked
// Go to Node Type down the page and select t2 if you don't want the default Node Type because it is way too expensive
// if you don't have high performance app, change number of replicas to NONE or 0 else you will pay high for it
// Under advance Redis Setting, Create new subnet
// Check all the available subnet
// That's all for this. We will setup the security group later so just leave that for now.
// Click on create at the bottom of the page


// =======================================================================================
// Creating security group that will allow all the 3 services to communicate to each other
// =======================================================================================

// Go to services and type vpc then select it from the options
// Select Security Groups under SECURITY from the left hand side of the vpc page
// On the Security Groups page, click on Create Security Group
// Fill in the Security Group name, Description and VPC fields respectively. 
// Provide a description for your security group.
// Make sure select the default VPC of your current application from the dropdown

// ========================================================================================
// Creating roles or rules that will allow traffic between any services that is assign to
// the security group
// ========================================================================================

// Select the Security Group from the last page up
// Go to Inbound Rules tab and click EDIT
// Leave the Type as Custom TCP Rule
// Leave Protocol as TCP(6)
// Change the Port Range between 5432-6379 (i.e postgres and redis default port number)
// Change the Source to your Security Group ID beside Custom field
// Click on Save to save all the changes

// ========================================================================================
// Assigning the created Security Group to each of our services (i.e EB instance, 
// RDS(postgres) and EC redis)
// ========================================================================================

// For redis, go to services and search elastic Cache and select it
// Select redis on the right hand side
// Click on the checkbox and click Modify at the top
// On the popup page, click on the edit icon and select your Security Group name on the new popup page
// Hit Save to save the changes
// Click on Modify button down the page and that's all from Elastic Cache Redis Service

// Next Service (RDS)
// Go to services and type rds and select it from the list
// Select INSTANCE or DATABASES on the left hand side
// Select your database instance on the page
// On the new page, click on Modify button
// Go to the Security section on the page and select your Security Group name in security group input field
// Go to the bottom and click Continue button
// under Scheduling of Modification on the new page, click on Apply immediately if you want it immediately or
// leave the default setting. But choose Apply Immediately
// Click on modify button

// Next service (Elasticbean Stalk)

// Go to services and type elasticbeanstalk and select it
// Click on your app in the EB environment
// On the new page click on CONFIGURATION on the sidebar
// Look for INSTANCES and click modify at the bottom
// Scroll to EC2 Security Group
// Select your security group on the list and click on apply
// Confirm the warning in the popup warning dialogue

// ==============================================================================================
// Setting environment variables on EB 
// ==============================================================================================

// Go to services and type elasticbeanstalk and select it
// Click on your app in the EB environment
// On the new page click on CONFIGURATION on the sidebar
// Look for SOFTWARE and click modify at the bottom
// Scroll to Environment Properties
/*
  Note: this step requires your environment variables as set in docker-compose.yml file.
  So go there and copy and paste as required.
  Also, their values are url not actual numbers.
  To get REDIS_HOST,
  1. goto services and type elastic cache then select it
  2. select redis on the left hand side 
  3. on the redis page, open the dropdown on redis instance
  3. look for primary end-point copy the value excluding the port number
  To get REDIS_PORT,
  copy the port number on the redis primary endpoint
*/

/**
 * Setting Database environment variables
 * 
 * Note: This is going to take all the database parameters you set on RDS.
 * 
 * For PGUSER (i.e database master username as set earlier)
 * 1. copy the username created as masterusername and paste for PGUSER
 * 2. copy the password you created for the masterusername and paste for PGPASSWORD
 * For PGHOST(i.e database host):
 * 1. go to services and type rds and select RDS to go to the rds dashboard
 * 2. click on the instances or database section on the side bar
 * 3. open up the database instance and scroll down to connect
 * 4. copy the endpoint and paste
 * 
 * For PGDATABASE(i.e database name you set earlier and have saved)
 * copy the database name you've set earlier during RDS SETTUP and paste
 * click on apply to save all the changes
*/


// ===========================================================================
// Setting up IAM on AWS for application deployment
// ===========================================================================

/**
 * After the last section, we are done with AWS Setup for our app.
 * Now we are going to setup AWS IAM to generate ACCESS_SECRETE_KEY AND
 * SECRT_ACCESS_ID. We will use them in our .travis.yml file for our deployment.
 * So, let's get to it!!!
 */
// step 1. 
// Go to services and type iam and select it
// Select USERS on the left hand side of the IAM page
// Click on ADD USER button and provide a username on input field
// Give the user Access type of Programmatic Access
// Click Next Permission
// On the new page, select ATTACH EXISTING POLICIES DIRECTLY
// Type beanstalk inside FILTER POLICY field and check all the policies on the page
// Then click NEXT REVIEW or NEXT:TAGS
// Click on next reviews
// Finally, click on CREATE USER
// Next, head straight to travis-ci.org to save the access key you have created
// Save them as: AWS_ACCESS_KEY and AWS_SECRET_KEY respectively

// ===========================================================================
// We are almost there!!! 
// Let's add the DEPLOY Script to .travis.yml file

// "option_settings": [
//   {
//    "Namespace": "aws:elasticbeanstalk:command",
//    "OptionName": "Timeout",
//    "Value": "3600"
//   }
// ]