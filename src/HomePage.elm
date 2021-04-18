module HomePage exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)

view : Html msg
view =
    div [ class "div-main-background" ]
        [ 
        headerView
        , bodyView
        , footerView
        ]

headerView : Html msg
headerView =
    div []
        [ languageView
        , titleView
        ]

languageView : Html msg
languageView =
    div
        [ class "div-header-intro-breakline" ]
        [ div [ class "div-header-intro-left-content" ]
            [ a [] [ text "EN" ] ]
        ]


titleView : Html msg
titleView =
    div []
        [ div
            [ class "div-title" ]
            [ text "Hi, I'm Hoàng!" ]
        , div
            [ class "div-sub-title" ]
            [ text "Welcome to my personal webpage!" ]
        ]

footerView : Html msg
footerView =
    div [ class "div-footer-breakline" ]
        [
            
        ]

bodyView : Html msg
bodyView =
    div [ class "div-main-content-background" ]
        [ leftMainDiv
        , mainDiv
        , rightMainDiv
        ]


leftMainDiv : Html msg
leftMainDiv =
    div [ class "div-left-main-content-background" ] []

rightMainDiv : Html msg
rightMainDiv =
    div [ class "div-right-main-content-background" ] []

mainDiv : Html msg
mainDiv =
    div
        [ class "div-main-main-content-background" ]
        [ 
            div [] [ introductionContentView ]
        ]


introductionContentView : Html msg
introductionContentView =
    div
        [ class "div-content-main-content" ]
        [ div [ style "margin" "5%" ] [ 
            text "Hi again!"
            , br [] []
            , br [] []
            , text "I tend to make the front of my webpage concise."
            , br [] []
            , text "For further information, please contact me via my personal email in my CV."
            , br [] []
            , br [] []
            , text "Here is my "
            , a [href "src/MyCV.pdf"] [text "CV"]
            , text "."
            , br [] []
            , br [] []
            , text "I'm currently:"
            , ul [] [
                li [ style "font-weight" "500" ] 
                    [ text "a Master student in Formal Methods at the Inter-University Program"
                    , br [] []
                    , text "at the Autónoma | Complutense | Politécnica Universidad de Madrid,"
                    ]
                ,li [ style "font-weight" "500" ] 
                    [ text "and a research assistant in Software Engineering and Programming Languages" 
                    , br [] []
                    , text "at the Vietnamese-German University, Binh Duong, Vietnam."
                    ]
            ]
            , text "I'm working on developing a model-driven methodology for enforcing fine-grained access control (FGAC) policies on database-centric applications."
            -- , ul [] [
            --     li [ style "font-weight" "500" ] 
            --         [ text "" 
            --         ]
            -- ]
            , br [] []
            , br [] []
            , text "I'm interested in:"
            , ul [] [
                li [ style "font-weight" "500" ] 
                    [ text "learning about the history of Programming Languages," 
                    ]
                , li [ style "font-weight" "500" ] 
                    [ text "proving things using Automated Theorem Provers," 
                    ]
                , li [ style "font-weight" "500" ] 
                    [ text "verifying programs using Verification Tools." 
                    ]
            ]
            -- , br [] []
            -- , text "I am interested in doing project about"
            -- , ul [] [
            --     li [ style "font-weight" "500" ] 
            --         [ text "Model-driven engineering: model-driven security, modeling language semantics, model analysis and validation, model-transformation," 
            --         ]
            --     ,li [ style "font-weight" "500" ] 
            --         [ text "and Specification and constraint languages: semantics, implementations and proof assistants." 
            --         ]
            --     ]
            -- , text "Here is my "
            -- , a [href "src/MyCV.pdf"] [text "CV"]
            -- , text "."
        ]
        ]

main : Html msg
main =
    view
