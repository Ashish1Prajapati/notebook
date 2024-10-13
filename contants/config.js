export const config = [
    {
        mode: "Normal",
        inputTitle: "Enter Space name",
        config: {
            tools: [
                {
                    title: "Pencil",
                    value: "pencil",
                    active: true,
                },
                {
                    title: "Line",
                    value: "line",
                    active: true
                },

                {
                    title: "Eraser",
                    value: "eraser",
                    active: true
                },
                {
                    title: "Undo Redo",
                    value: "history",
                    active: true
                }
            ],
            strockWidth: [
                {
                    title: "Fine",
                    value: "3",
                    active: true,
                },
                {
                    title: "Medium",
                    value: "6",
                    active: true,
                },
                {
                    title: "Thick",
                    value: "12",
                    active: true,
                },
                {
                    title: "Custom Stroke Width",
                    value: "custom",
                    active: true,
                },
            ],
            colors: [
                {
                    title: "black",
                    value: "#000000",
                    active: true
                },
                {
                    title: "green",
                    value: "#008000",
                    active: true
                },
                {
                    title: "light green",
                    value: "#90EE90",
                    active: true
                },
                {
                    title: "blue",
                    value: "#0000FF",
                    active: true
                },
                {
                    title: "light blue",
                    value: "#50e3c2",
                    active: true
                },
                {
                    title: "gray",
                    value: "#808080",
                    active: true
                },
                {
                    title: "red",
                    value: "#FF0000",
                    active: true
                },
                {
                    title: "magenta",
                    value: "#FF00FF",
                    active: true
                },
                {
                    title: "orange",
                    value: "#FFA500",
                    active: true
                },
                {
                    title: "yello",
                    value: "#FFFF00",
                    active: true
                },
                {
                    title: "white",
                    value: "#FFFFFF",
                    active: true
                },
                {
                    title: "custom color",
                    value: "custom",
                    active: true
                },
            ],
            pages: [
                {
                    title: "Number Of Pages",
                    value: 1,
                    type: "input",
                    active: true,
                },
                {
                    title: "Add new Page",
                    value: "addPage",
                    active: true,
                },
                {
                    title: "Delete Page",
                    value: "deletePage",
                    active: true,
                },
                {
                    title: "Page Up",
                    value: "pageUp",
                    active: true,
                },
                {
                    title: "Page Down",
                    value: "pageDown",
                    active: true,
                },
                {
                    title: "Page Duplicate",
                    value: "pageDuplicate",
                    active: true,
                },
            ],
            others: [

                {
                    title: "Download Pdf",
                    value: "downloadPdf",
                    active: true,
                },
                {
                    title: "Clean Canvas",
                    value: "clear",
                    active: true,
                },
                {
                    title: "Save",
                    value: "save",
                    active: true,
                },
                {
                    title: "Configuration",
                    value: "configuration",
                    active: true,
                },
                {
                    title: "Scale",
                    value: "scale",
                    active: true,
                },
                {
                    title: "Auto Save",
                    value: "autoSave",
                    active: false,
                },
            ]
        }
    },
    {
        mode: "Exam",
        inputTitle: "Subject/Paper Name",
        config: {
            tools: [
                {
                    title: "Pencil",
                    value: "pencil",
                    active: true,
                },
                {
                    title: "Line",
                    value: "line",
                    active: true
                },

                {
                    title: "Eraser",
                    value: "eraser",
                    active: true
                },
                {
                    title: "Undo Redo",
                    value: "history",
                    active: false
                }
            ],
            strockWidth: [
                {
                    title: "Fine",
                    value: "3",
                    active: true,
                },
                {
                    title: "Medium",
                    value: "6",
                    active: false,
                },
                {
                    title: "Thick",
                    value: "12",
                    active: false,
                },
                {
                    title: "Custom Stroke Width",
                    value: "custom",
                    active: false,
                },
            ],
            colors: [
                {
                    title: "black",
                    value: "#000000",
                    active: true
                },
                {
                    title: "green",
                    value: "#008000",
                    active: false
                },
                {
                    title: "light green",
                    value: "#90EE90",
                    active: false
                },
                {
                    title: "blue",
                    value: "#0000FF",
                    active: true
                },
                {
                    title: "light blue",
                    value: "#50e3c2",
                    active: false
                },
                {
                    title: "gray",
                    value: "#808080",
                    active: false
                },
                {
                    title: "red",
                    value: "#FF0000",
                    active: false
                },
                {
                    title: "magenta",
                    value: "#FF00FF",
                    active: false
                },
                {
                    title: "orange",
                    value: "#FFA500",
                    active: false
                },
                {
                    title: "yello",
                    value: "#FFFF00",
                    active: false
                },
                {
                    title: "white",
                    value: "#FFFFFF",
                    active: false
                },
                {
                    title: "custom color",
                    value: "custom",
                    active: false
                },
            ],
            pages: [
                {
                    title: "Number Of Pages",
                    value: 20,
                    type: "input",
                    active: true,
                },
                {
                    title: "Add new Page",
                    value: "addPage",
                    active: true,
                },
                {
                    title: "Delete Page",
                    value: "deletePage",
                    active: false,
                },
                {
                    title: "Page Up",
                    value: "pageUp",
                    active: false,
                },
                {
                    title: "Page Down",
                    value: "pageDown",
                    active: false,
                },
                {
                    title: "Page Duplicate",
                    value: "pageDuplicate",
                    active: false,
                },
            ],
            others: [

                {
                    title: "Download Pdf",
                    value: "downloadPdf",
                    active: false,
                },
                {
                    title: "Clean Canvas",
                    value: "clear",
                    active: false,
                },
                {
                    title: "Save",
                    value: "save",
                    active: true,
                },
                {
                    title: "Configuration",
                    value: "configuration",
                    active: false,
                },
                {
                    title: "Scale",
                    value: "scale",
                    active: false,
                },
                {
                    title: "Auto Save",
                    value: "autoSave",
                    active: false,
                },
            ],
            exam: [
                {
                    title: "1 Hours",
                    value: "1h"

                },
                {
                    title: "3 Hours",
                    value: "3h"
                },
                {
                    title: "5 Hours",
                    value: "5h"

                },
            ]
        }
    }
]