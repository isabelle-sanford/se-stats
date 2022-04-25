
Sub PrintPlayerData()

    ' set up sheet acess
    Dim Interface, Data, Info As Worksheet
    Set Interface = Worksheets("Interface")
    Set Data = Worksheets("Data")
    Set Info = Worksheets("Info")

    ' Get inputs out of form 
    Dim GetLG, GetMR, GetQF As Boolean 
    GetLG = Range("Info!I6").Value
    GetMR = Range("Info!I8").Value
    GetQF = Range("Info!I9").Value

    ' player # and associated name
    Dim PlayerNo As Integer
    PlayerNo = Range("Info!I4").Value
    
    Dim PlayerName As String
    PlayerName = Info.Cells(PlayerNo + 1, 1).Value 

    ' where to put table output (should clear, oh well)
    Dim IntfRow As Integer
    IntfRow = 29

    ' loop through Data and put matching rows into Interface
    Dim i As Integer
    For i = 2 To 5900

        If Data.Cells(i, 2).Value = PlayerName Then  'data

            Dim format As String
            format = Data.Cells(i, 14).Value
            If (format = "LG" And Not GetLG) Then
            ElseIf (format = "MR" And Not GetMR) Then
            ElseIf (format = "QF" And Not GetQF) Then

            Else
                Interface.Cells(IntfRow, 2).Value = Data.Cells(i, 16).Value ' game
                Interface.Cells(IntfRow, 3).Value = Data.Cells(i, 4).Value ' faction outcome
                Interface.Cells(IntfRow, 4).Value = Data.Cells(i, 3).Value ' alignment
                Interface.Cells(IntfRow, 5).Value = Data.Cells(i, 8).Value ' personal outcome
                
            IntfRow = IntfRow + 1
            
            End If

        End If
    Next i




End Sub

