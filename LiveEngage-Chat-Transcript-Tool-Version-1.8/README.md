# LiveEngage-Chat-Transcript-Tool
XML Parser tool that can be used to read in the chat transcripts from LiveEngage. 

You can view a live example of the tool here: http://scottwestover.github.io/

##Instructions For Using The XML Chat Transcript Widget

Note - This tool is still under development. As you are using the tool if anything unexpected happens, please fill out the feedback form that is linked on the popup page. This will help me fix any bugs or unexpected issues that occur and make this tool better.

1. You will need to export your chat transcript data from your LiveEngage Account as an XML file.
2. Open up the extension in Chrome by clicking on the icon, or by opening the popup.html file by double clicking on it if you are running it locally.
3. Once the page loads in your browser, click on the "Choose File" button to load your XML file. 
4. Your chats should then populate into the table.
5. You can then click on the green plus icon to expand the row to show more data.
6. You can search the transcripts by using the built in search bar. 

##Format Chat Transcript and Surveys In Excel

When the table is exported to Excel, I added in custom code that can be used to format the cells for the Chat transcript and the Surveys so all of the text is not on one line. If you do not format the code, in these cells you will see the following text '#NEL#Test#'.

Here is how to format the cells:

1. Hit Ctrl + F to open the Find & Replace dialog
2. Click on the Replace tab
3. In the Find what: field add #NEL#Test#
4. In the Replace with: field, press Ctrl + J, nothing will show in the field
5. Click Replace All

##Updates
Master - Fixed issue where the show entries button the table was not appearing.

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

##Disclaimer
This tool is created to help you parse and read the transcripts that are provided by LivePerson. This is not a product that is supported by LivePerson.  This type of tool can be used as an example for your developers to create your own custom reporting