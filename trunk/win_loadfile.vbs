'----------------------------------------------------------------------------------------------------------------------------   
'Initialization  Section      
'----------------------------------------------------------------------------------------------------------------------------   
Option Explicit
Dim objFSO, scriptBaseName
On Error Resume Next
   Set objFSO     = CreateObject("Scripting.FileSystemObject")
   scriptBaseName = objFSO.GetBaseName(Wscript.ScriptFullName)
   If Err.Number <> 0 Then
      Wscript.Quit
   End If
On Error Goto 0
'CenterWindow   
'----------------------------------------------------------------------------------------------------------------------------   
'Functions Processing Section      
'----------------------------------------------------------------------------------------------------------------------------   
'Name       : ProcessScript -> Primary Function that controls all other script processing.      
'Parameters : None          ->   
'Return     : None          ->      
'----------------------------------------------------------------------------------------------------------------------------   
Function ProcessScript(buttonPressed)
   Dim fileSpec, folderSpec
   Select Case LCase(buttonPressed)
      Case "file"
         If Not SelectFile("C:\", fileSpec, "Bagpipe Music Writer|*.bww|All Files|*.*") Then
            Exit Function
         Else
            MsgBox "You selected " & fileSpec, vbInformation
         End If
      Case "folder"
         If Not SelectFolder(folderSpec) Then
            Exit Function
         Else
            MsgBox "You selected " & folderSpec, vbInformation
         End If
   End Select   
End Function   
'----------------------------------------------------------------------------------------------------------------------------   
'Name       : CenterWindow -> Centers the HTA window vertically and horizontally in the middle of the screen.   
'Parameters : None         ->      
'Return     : None         ->      
'----------------------------------------------------------------------------------------------------------------------------   
Function CenterWindow   
   Dim wmi, results, result   
   Dim displayWidth, displayHeight, x, y   
   On Error Resume Next  
      Set wmi     = GetObject("winmgmts:\\.\root\cimv2")   
      Set results = wmi.ExecQuery("Select * From Win32_DesktopMonitor")   
      For Each result In results   
         displayWidth  = result.ScreenWidth   
         displayHeight = result.ScreenHeight   
      Next  
      x = (displayWidth  - 250) / 2   
      y = (displayHeight - 120) / 2   
      If x < 0 Or y < 0 Then  
         x = 0   
         y = 0   
      End If  
      window.resizeTo 250,120   
      window.moveTo x, y   
   On Error Goto 0   
End Function
'----------------------------------------------------------------------------------------------------------------------------
'Name       : SelectFolder -> Opens the shell object to allow the user to browse for and select the file on their computer.
'Parameters : folderSpec   -> Output: The UNC folder path.
'Return     : SelectFolder -> Returns an False or True and the UNC path of the file selected.
'----------------------------------------------------------------------------------------------------------------------------
Function SelectFolder(folderSpec)
   Dim objShell, objFolder
   SelectFolder = False
   On Error Resume Next
      Set objShell = CreateObject("Shell.Application")
      If Err.Number <> 0 Then
         Exit Function
      End If
      Set objFolder = objShell.BrowseForFolder(0, scriptBaseName, 0)
      If Err.Number <> 0 Then
         Exit Function
      Else
         folderSpec = objFolder.Self.Path
         If Err.Number <> 0 Then
            Exit Function
         End If
      End If      
   On Error Goto 0
   SelectFolder = True 
End Function
'----------------------------------------------------------------------------------------------------------------------------
'Name       : SelectFile -> Opens a dialog box to allow the user select a file on their computer.
'Parameters : folderSpec -> Output: The UNC folder path.
'           : fileName   -> Output: The full file name including the folder path.
'           : filter     -> A string containing the filter for the UserAccounts.CommonDialog object.
'Return     : SelectFile -> Returns an False or True and the name of the file selected.
'----------------------------------------------------------------------------------------------------------------------------
Function SelectFile(folderSpec, fileSpec, filter)
   Dim dialog, result
   SelectFile = False
   On Error Resume Next
      Set dialog = CreateObject("UserAccounts.CommonDialog")
      If Err.Number <> 0 Then
         Exit Function
      End If
      dialog.InitialDir = folderSpec
      dialog.Filter     = filter
      result            = dialog.ShowOpen
      If result <> 0 Then
         SelectFile = True
         fileSpec   = dialog.fileName
      End If
   On Error Goto 0
End Function
