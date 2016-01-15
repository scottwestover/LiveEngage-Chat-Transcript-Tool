# LiveEngage-Chat-Transcript-Tool
XML Parser tool that can be used to read in the chat transcripts from LiveEngage. 

You can view a live example of the tool here: http://scottwestover.github.io/

##Instructions For Using The XML Chat Transcript Widget

Note - This tool is still under development. As you are using the tool if anything unexpected happens, please fill out the feedback form that is linked on the popup page. This will help me fix any bugs or unexpected issues that occur and make this tool better.

1. You will need to export your chat transcript data from your LiveEngage Account as an XML file.
2. Open up the webpage in Chrome, or by opening the index.html file by double clicking on it if you are running it locally.
3. Once the page loads in your browser, choose which reports you would like to generate.
4. Once you complete this, click on the "Choose File" button to load your XML file. 
5. Your chats should then populate into the table.
6. You can then click on the green plus icon to expand the row to show more data.
7. You can search the transcripts by using the built in search bar. 
8. You can switch between the reports by clicking on the different tabs. 

##Format Chat Transcript and Surveys In Excel

When the table is exported to Excel, I added in custom code that can be used to format the cells for the Chat transcript and the Surveys so all of the text is not on one line. If you do not format the code, in these cells you will see the following text '#NEL#Test#'.

Here is how to format the cells:

1. Hit Ctrl + F to open the Find & Replace dialog
2. Click on the Replace tab
3. In the Find what: field add #NEL#Test#
4. In the Replace with: field, press Ctrl + J, nothing will show in the field
5. Click Replace All

##Updates
Master - Fixed an issue with the agent survey that could occur when a post chat survey did not have an agent tied to it.

* Version 1.0 
 * Initial Release
* Version 1.1 
 * Added in ability to search each survey
* Version 1.2 
 * Fixed issue where repName was not loading properly
* Version 1.3 
 * Fixed issue where the date on the chat lines was not displaying correctly
 * Updated the interface to now have revenue on its own tab
 * Added reporting for: agent/visitor average response time, average response time by agent, and CSAT reporting
* Version 1.4 
 * Update Revenue tab to include total conversion and average order value
 * Added Heatmap that displays where chats are coming from
* Version 1.5 
 * Added local storage to save the Order Total Variable
 * Added pages for instructions and how to use the XML tool
 * Fixed issue where map would not always load properly
 * Fixed an issue where revenue would not populate
 * Added tool tips to the tool
* Version 1.6 
 * Added the ability to export to Excel and copy contents of the table
 * Added a field to choose your own custom CSAT Question by using its ID
 * Added a cookie to save the ID of the CSAT Question and a tooltip for the CSAT Question ID
* Version 1.7
 * Updated the interface to now have a button for choosing which columns are visible
 * The drop down for the column visibility makes it easier to see which columns are visibile/not visible
 * Added disclaimer to the tool
* Version 1.8
 * Removed the animation for the graphs to improve the load time
 * Updated the default Excel export name to now be the current date
 * Added the ability to format the chat transcripts and the surveys in Excel
* Version 1.9
 * Fixed issue where the show entries button on the table was not appearing
* Version 2.0
 * Updated error handling code
* Version 2.1
 * Cleaned up the code and added comments
 * Added in option to choose which reports you want generated
 * Added new tab for custom reports that will allow you to choose the questions from your surveys and get statistics on them
 * Added in CSAT by agent
 * Fixed issue where pie chart was moving when you hover over it
* Version 2.1.1
 * Updated instructions to include how to format the data in Excel when you export the table.
* Version 2.1.2
 * Fixed issue where there was not time displayed for offline surveys
 * Added in data for disconnect reason to data table
 * Added a Disconnected By Report 
 * Added in an option to exlclude non-interactive chats from the transcript, these chats will not show in the table, or in the reports
* Version 2.1.3
 * Added the following columns to the table: Agent Response Time (since first message in most recent user block), Failed SLAs by representative (for the previous), Agent Response Time (since last message in most recent user block), Failed SLAs by representative (for the previous), Interactive (Y or blank)
 * Various typing errors have been fixed
 * Added a contribution page that can be accessed from the 'how to use section'
* Version 2.1.4
 * Fixed issue where survey search fields where not searching the correct surveys
* Version 2.1.5
 * Added tooltip for failed SLAs if you hover over the column header

##Contribution
I just wanted to say thanks to following users for helping contribute to this tool.

* [shockkolate](https://github.com/shockkolate)
 * shockkolate contributed the following:
  * Agent Response Time (since first message in most recent user block)
  * Failed SLAs by representative (for the above)
  * Agent Response Time (since last message in most recent user block)
  * Failed SLAs by representative (for the above)
  * Interactive (Y or blank)

##Disclaimer
This tool is created to help you parse and read the transcripts that are provided by LivePerson. This is not a product that is supported by LivePerson.  This type of tool can be used as an example for your developers to create your own custom reporting. 

It is recommended that you use this tool in Chrome.