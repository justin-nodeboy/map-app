export const TRANSITIONS = {
    overlay: {
        enterFromClass: 'opacity-0 scale-75',
        enterActiveClass: 'transition-transform transition-opacity duration-150 ease-in',
        leaveActiveClass: 'transition-opacity duration-150 ease-linear',
        leaveToClass: 'opacity-0'
    }
};

const MyDesignSystem = {
    menubar: {
        root: {
            class: ['p-2 dark:bg-gray-900 border border-gray-300 dark:border-blue-900/40 rounded-md', 'flex items-center relative']
        },
        menu: ({props}) => ({
            class: [
                'm-0 sm:p-0 list-none',
                'outline-none',
                'sm:flex items-center flex-wrap sm:flex-row sm:top-auto sm:left-auto sm:relative sm:bg-transparent sm:shadow-none sm:w-auto',
                'flex-col top-full left-0',
                'absolute py-1 bg-white dark:bg-gray-900 border-0 shadow-md w-full',
                {
                    'hidden ': !props?.mobileActive,
                    'flex ': props?.mobileActive
                }
            ]
        }),
        menuitem: 'sm:relative sm:w-auto w-full static',
        content: ({props, context}) => ({
            class: [
                ' transition-shadow duration-200',
                '',
                {'rounded-md': props.root},
                {
                    'text-white dark:text-white/80': !context.focused && !context.active && props.root,
                    'text-gray-700 dark:text-white/80': !context.focused && !context.active && !props.root,
                    'bg-gray-300 text-gray-700 dark:text-white/80 dark:bg-gray-800/90': context.focused && !context.active,
                    'bg-blue-100 text-blue-700 dark:bg-blue-400 dark:text-white/80': context.focused && context.active,
                    'bg-blue-50 text-blue-700 dark:bg-blue-300 dark:text-white/80': !context.focused && context.active
                },
                {
                    'hover:text-gray-700 dark:hover:text-white/80 hover:bg-gray-200 dark:hover:bg-gray-800/80': !context.active,
                    'hover:bg-blue-200 dark:hover:bg-blue-500': context.active
                }
            ]
        }),
        action: ({context}) => ({
            class: [
                'select-none',
                'cursor-pointer flex items-center no-underline overflow-hidden relative',
                'py-3 px-5 select-none',
                {
                    'max-[960px]:pl-9': context.level === 1,
                    'max-[960px]:pl-14': context.level === 2
                }
            ]
        }),
        icon: 'mr-2',
        submenuicon: ({props}) => ({
            class: [
                'max-[960px]:ml-auto',
                {
                    'ml-2': props.root,
                    'ml-auto': !props.root
                }
            ]
        }),
        submenu: ({props}) => ({
            class: [
                'py-1 bg-white dark:bg-gray-900 border-0  sm:shadow-md sm:w-48',
                'w-full static shadow-none',
                'sm:absolute z-10',
                'm-0 list-none',
                {
                    'sm:absolute sm:left-full sm:top-0': props.level > 1
                }
            ]
        }),
        separator: 'border-t border-gray-300 dark:border-blue-900/40 my-1',
        button: {
            class: [
                'flex sm:hidden w-8 h-8 rounded-full text-gray-600 dark:text-white/80 transition duration-200 ease-in-out',
                'cursor-pointer flex items-center justify-center no-underline',
                'hover:text-gray-700 dark:hover:text-white/80 hover:bg-gray-200 dark:hover:bg-gray-800/80 ',
                'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]'
            ]
        }
    },
    datatable: {
        root: ({props}) => ({
            class: [
                'relative',
                {
                    'flex flex-col h-full': props.scrollable && props.scrollHeight === 'flex'
                }
            ]
        }),
        loadingoverlay: {
            class: [
                'fixed w-full h-full t-0 l-0 bg-gray-100/40',
                'transition duration-200',
                'absolute flex items-center justify-center z-2',
                'dark:bg-gray-950/40' // Dark Mode
            ]
        },
        loadingicon: 'w-8 h-8',
        wrapper: ({props}) => ({
            class: [
                {
                    relative: props.scrollable,
                    'flex flex-col grow h-full': props.scrollable && props.scrollHeight === 'flex'
                }
            ]
        }),
        header: ({props}) => ({
            class: [
                'bg-slate-50 text-slate-700 border-gray-300 font-bold p-4',
                'dark:border-blue-900/40 dark:text-white/80 dark:bg-gray-900', // Dark Mode
                props.showGridlines ? 'border-x border-t border-b-0' : 'border-y border-x-0'
            ]
        }),
        table: 'w-full border-spacing-0',
        thead: ({context}) => ({
            class: [
                {
                    'bg-slate-50 top-0 z-[1]': context.scrollable
                }
            ]
        }),
        tbody: ({instance, context}) => ({
            class: [
                {
                    'sticky z-[1]': instance.frozenRow && context.scrollable
                }
            ]
        }),
        tfoot: ({context}) => ({
            class: [
                {
                    'bg-slate-50 bottom-0 z-[1]': context.scrollable
                }
            ]
        }),
        footer: {
            class: [
                'bg-slate-50 text-slate-700 border-t-0 border-b border-x-0 border-gray-300 font-bold p-4',
                'dark:border-blue-900/40 dark:text-white/80 dark:bg-gray-900' // Dark Mode
            ]
        },
        column: {
            headercell: ({context, props}) => ({
                class: [
                    'text-left border-0 border-b border-solid border-gray-300 dark:border-blue-900/40 font-bold',
                    'transition duration-200',
                    context?.size === 'small' ? 'p-2' : context?.size === 'large' ? 'p-5' : 'p-4', // Size
                    context.sorted ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-700', // Sort
                    context.sorted ? 'dark:text-white/80 dark:bg-blue-300' : 'dark:text-white/80 dark:bg-gray-900', // Dark Mode
                    {
                        'sticky z-[1]': props.frozen || props.frozen === '', // Frozen Columns
                        'border-x border-y': context?.showGridlines,
                        'overflow-hidden space-nowrap border-y relative bg-clip-padding': context.resizable // Resizable
                    }
                ]
            }),
            headercontent: 'flex items-center',
            bodycell: ({props, context}) => ({
                class: [
                    'text-left border-0 border-b border-solid border-gray-300',
                    context?.size === 'small' ? 'p-2' : context?.size === 'large' ? 'p-5' : 'p-4', // Size
                    'dark:text-white/80 dark:border-blue-900/40', // Dark Mode
                    {
                        'sticky bg-inherit': props.frozen || props.frozen === '', // Frozen Columns
                        'border-x border-y': context?.showGridlines
                    }
                ]
            }),
            footercell: ({context}) => ({
                class: [
                    'text-left border-0 border-b border-solid border-gray-300 font-bold',
                    'bg-slate-50 text-slate-700',
                    'transition duration-200',
                    context?.size === 'small' ? 'p-2' : context?.size === 'large' ? 'p-5' : 'p-4', // Size
                    'dark:text-white/80 dark:bg-gray-900 dark:border-blue-900/40', // Dark Mode
                    {
                        'border-x border-y': context?.showGridlines
                    }
                ]
            }),
            sorticon: ({context}) => ({
                class: ['ml-2', context.sorted ? 'text-blue-700 dark:text-white/80' : 'text-slate-700 dark:text-white/70']
            }),
            sortbadge: {
                class: [
                    'flex items-center justify-center align-middle',
                    'rounded-[50%] w-[1.143rem] leading-[1.143rem] ml-2',
                    'text-blue-700 bg-blue-50',
                    'dark:text-white/80 dark:bg-blue-400' // Dark Mode
                ]
            },
            columnfilter: 'inline-flex items-center ml-auto',
            filteroverlay: {
                class: [
                    'bg-white text-gray-600 border-0 rounded-md min-w-[12.5rem]',
                    'dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80' //Dark Mode
                ]
            },
            filtermatchmodedropdown: {
                root: 'min-[0px]:flex mb-2'
            },
            filterrowitems: 'm-0 p-0 py-3 list-none ',
            filterrowitem: ({context}) => ({
                class: ['m-0 py-3 px-5 bg-transparent', 'transition duration-200', context?.highlighted ? 'text-blue-700 bg-blue-100 dark:text-white/80 dark:bg-blue-300' : 'text-gray-600 bg-transparent dark:text-white/80 dark:bg-transparent']
            }),
            filteroperator: {
                class: [
                    'px-5 py-3 border-b border-solid border-gray-300 text-slate-700 bg-slate-50 rounded-t-md',
                    'dark:border-blue-900/40 dark:text-white/80 dark:bg-gray-900' // Dark Mode
                ]
            },
            filteroperatordropdown: {
                root: 'min-[0px]:flex'
            },
            filterconstraint: 'p-5 border-b border-solid border-gray-300 dark:border-blue-900/40',
            filteraddrule: 'py-3 px-5',
            filteraddrulebutton: {
                root: 'justify-center w-full min-[0px]:text-sm',
                label: 'flex-auto grow-0',
                icon: 'mr-2'
            },
            filterremovebutton: {
                root: 'ml-2',
                label: 'grow-0'
            },
            filterbuttonbar: 'flex items-center justify-between p-5',
            filterclearbutton: {
                root: 'w-auto min-[0px]:text-sm border-blue-500 text-blue-500 px-4 py-3'
            },
            filterapplybutton: {
                root: 'w-auto min-[0px]:text-sm px-4 py-3'
            },
            filtermenubutton: ({context}) => ({
                class: [
                    'inline-flex justify-center items-center cursor-pointer no-underline overflow-hidden relative ml-2',
                    'w-8 h-8 rounded-[50%]',
                    'transition duration-200',
                    'hover:text-slate-700 hover:bg-gray-300/20', // Hover
                    'focus:outline-0 focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', // Focus
                    'dark:text-white/70 dark:hover:text-white/80 dark:bg-gray-900', // Dark Mode
                    {
                        'bg-blue-50 text-blue-700': context.active
                    }
                ]
            }),
            headerfilterclearbutton: ({context}) => ({
                class: [
                    'inline-flex justify-center items-center cursor-pointer no-underline overflow-hidden relative',
                    'text-left bg-transparent m-0 p-0 border-none select-none ml-2',
                    {
                        invisible: !context.hidden
                    }
                ]
            }),
            columnresizer: 'block absolute top-0 right-0 m-0 w-2 h-full p-0 cursor-col-resize border border-transparent',
            rowreordericon: 'cursor-move',
            roweditorinitbutton: {
                class: [
                    'inline-flex items-center justify-center overflow-hidden relative',
                    'text-left cursor-pointer select-none',
                    'w-8 h-8 border-0 rounded-[50%]',
                    'transition duration-200',
                    'text-slate-700 border-transparent',
                    'focus:outline-0 focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', //Focus
                    'hover:text-slate-700 hover:bg-gray-300/20', //Hover
                    'dark:text-white/70' // Dark Mode
                ]
            },
            roweditorsavebutton: {
                class: [
                    'inline-flex items-center justify-center overflow-hidden relative',
                    'text-left cursor-pointer select-none',
                    'w-8 h-8 border-0 rounded-[50%]',
                    'transition duration-200',
                    'text-slate-700 border-transparent',
                    'focus:outline-0 focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', //Focus
                    'hover:text-slate-700 hover:bg-gray-300/20', //Hover
                    'dark:text-white/70' // Dark Mode
                ]
            },
            roweditorcancelbutton: {
                class: [
                    'inline-flex items-center justify-center overflow-hidden relative',
                    'text-left cursor-pointer select-none',
                    'w-8 h-8 border-0 rounded-[50%]',
                    'transition duration-200',
                    'text-slate-700 border-transparent',
                    'focus:outline-0 focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', //Focus
                    'hover:text-slate-700 hover:bg-gray-300/20', //Hover
                    'dark:text-white/70' // Dark Mode
                ]
            },
            radiobuttonwrapper: {
                class: ['relative inline-flex cursor-pointer select-none align-bottom', 'w-6 h-6']
            },
            radiobutton: ({context}) => ({
                class: [
                    'flex justify-center items-center',
                    'border-2 w-6 h-6 text-gray-700 rounded-full transition duration-200 ease-in-out',
                    context.checked ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400' : 'border-gray-300 bg-white dark:border-blue-900/40 dark:bg-gray-900',
                    {
                        'hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]': !context.disabled,
                        'cursor-default opacity-60': context.disabled
                    }
                ]
            }),
            radiobuttonicon: ({context}) => ({
                class: ['transform rounded-full', 'block w-3 h-3 transition duration-200 bg-white dark:bg-gray-900', {
                    'backface-hidden scale-10 invisible': context.checked === false,
                    'transform scale-100 visible': context.checked === true
                }]
            }),
            headercheckboxwrapper: {
                class: ['cursor-pointer inline-flex relative select-none align-bottom', 'w-6 h-6']
            },
            headercheckbox: ({context}) => ({
                class: [
                    'flex items-center justify-center',
                    'border-2 w-6 h-6 text-gray-600 rounded-lg transition-colors duration-200',
                    context.checked ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400' : 'border-gray-300 bg-white dark:border-blue-900/40 dark:bg-gray-900',
                    {
                        'hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]': !context.disabled,
                        'cursor-default opacity-60': context.disabled
                    }
                ]
            }),
            headercheckboxicon: 'w-4 h-4 transition-all duration-200 text-white text-base dark:text-gray-900',
            checkboxwrapper: {
                class: ['cursor-pointer inline-flex relative select-none align-bottom', 'w-6 h-6']
            },
            checkbox: ({context}) => ({
                class: [
                    'flex items-center justify-center',
                    'border-2 w-6 h-6 text-gray-600 rounded-lg transition-colors duration-200',
                    context.checked ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400' : 'border-gray-300 bg-white dark:border-blue-900/40 dark:bg-gray-900',
                    {
                        'hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]': !context.disabled,
                        'cursor-default opacity-60': context.disabled
                    }
                ]
            }),
            checkboxicon: 'w-4 h-4 transition-all duration-200 text-white text-base dark:text-gray-900',
            transition: TRANSITIONS.overlay
        },
        bodyrow: ({context}) => ({
            class: [
                context.selected ? 'bg-blue-50 text-blue-700 dark:bg-blue-300' : 'bg-white text-gray-600 dark:bg-gray-900',
                context.stripedRows ? (context.index % 2 === 0 ? 'bg-white text-gray-600 dark:bg-gray-900' : 'bg-blue-50/50 text-gray-600 dark:bg-gray-950') : '',
                'transition duration-200',
                'focus:outline focus:outline-[0.15rem] focus:outline-blue-200 focus:outline-offset-[-0.15rem]', // Focus
                'dark:text-white/80 dark:focus:outline dark:focus:outline-[0.15rem] dark:focus:outline-blue-300 dark:focus:outline-offset-[-0.15rem]', // Dark Mode
                {
                    'cursor-pointer': context.selectable,
                    'hover:bg-gray-300/20 hover:text-gray-600': context.selectable && !context.selected // Hover
                }
            ]
        }),
        rowexpansion: 'bg-white text-gray-600 dark:bg-gray-900 dark:text-white/80',
        rowgroupheader: {
            class: ['sticky z-[1]', 'bg-white text-gray-600', 'transition duration-200']
        },
        rowgroupfooter: {
            class: ['sticky z-[1]', 'bg-white text-gray-600', 'transition duration-200']
        },
        rowgrouptoggler: {
            class: [
                'text-left m-0 p-0 cursor-pointer select-none',
                'inline-flex items-center justify-center overflow-hidden relative',
                'w-8 h-8 text-gray-500 border-0 bg-transparent rounded-[50%]',
                'transition duration-200',
                'dark:text-white/70' // Dark Mode
            ]
        },
        rowgrouptogglericon: 'inline-block w-4 h-4',
        resizehelper: 'absolute hidden w-px z-10 bg-blue-500 dark:bg-blue-300'
    },
    inputtext: {
        root: ({props, context}) => ({
            class: [
                'm-0',
                'font-sans text-gray-600 dark:text-white/80 bg-white dark:bg-gray-900 border border-gray-300 dark:border-blue-900/40 transition-colors duration-200 appearance-none rounded-lg',
                {
                    'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]': !context.disabled,
                    'opacity-60 select-none pointer-events-none cursor-default': context.disabled
                },
                {
                    'text-lg px-4 py-4': props.size == 'large',
                    'text-xs px-2 py-2': props.size == 'small',
                    'p-3 text-base': props.size == null
                }
            ]
        })
    },
    checkbox: {
        root: {
            class: ['cursor-pointer inline-flex relative select-none align-bottom', 'w-6 h-6']
        },
        input: ({props, context}) => ({
            class: [
                'flex items-center justify-center',
                'border-2 w-6 h-6 text-gray-600 rounded-lg transition-colors duration-200',
                {
                    'border-gray-300 bg-white dark:border-blue-900/40 dark:bg-gray-900': !context.checked,
                    'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400': context.checked
                },
                {
                    'hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]': !props.disabled,
                    'cursor-default opacity-60': props.disabled
                }
            ]
        }),
        icon: 'w-4 h-4 transition-all duration-200 text-white text-base dark:text-gray-900'
    },
    dialog: {
        root: ({state}) => ({
            class: [
                'rounded-lg shadow-lg border-0',
                'max-h-90 transform scale-100',
                'm-0 w-[50vw]',
                'dark:border dark:border-blue-900/40',
                {
                    'transition-none transform-none !w-screen !h-screen !max-h-full !top-0 !left-0': state.maximized
                }
            ]
        }),
        header: {
            class: ['flex items-center justify-between shrink-0', 'bg-white text-gray-800 border-t-0  rounded-tl-lg rounded-tr-lg p-6', 'dark:bg-gray-900  dark:text-white/80']
        },
        headerTitle: {
            class: 'font-bold text-lg'
        },
        headerIcons: {
            class: 'flex items-center'
        },
        closeButton: {
            class: [
                'flex items-center justify-center overflow-hidden relative',
                'w-8 h-8 text-gray-500 border-0 bg-transparent rounded-full transition duration-200 ease-in-out mr-2 last:mr-0',
                'hover:text-gray-700 hover:border-transparent hover:bg-gray-200',
                'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', // focus
                'dark:hover:text-white/80 dark:hover:border-transparent dark:hover:bg-gray-800/80 dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]'
            ]
        },
        closeButtonIcon: {
            class: 'w-4 h-4 inline-block'
        },
        content: ({state, instance}) => ({
            class: [
                'overflow-y-auto',
                'bg-white text-gray-700 px-6 pb-8 pt-0',
                ,
                'dark:bg-gray-900  dark:text-white/80',
                {
                    grow: state.maximized
                },
                {
                    'rounded-bl-lg rounded-br-lg': !instance.$slots.footer
                }
            ]
        }),
        footer: {
            class: ['flex gap-2 shrink-0 justify-end align-center', 'border-t-0 bg-white text-gray-700 px-6 pb-6 text-right rounded-b-lg', 'dark:bg-gray-900  dark:text-white/80']
        },
        mask: ({props}) => ({
            class: ['transition duration-200', {'bg-black/40': props.modal}]
        }),
        transition: ({props}) => {
            return props.position === 'top'
                ? {
                    enterFromClass: 'opacity-0 scale-75 translate-x-0 -translate-y-full translate-z-0',
                    enterActiveClass: 'transition-all duration-200 ease-out',
                    leaveActiveClass: 'transition-all duration-200 ease-out',
                    leaveToClass: 'opacity-0 scale-75 translate-x-0 -translate-y-full translate-z-0'
                }
                : props.position === 'bottom'
                    ? {
                        enterFromClass: 'opacity-0 scale-75 translate-y-full',
                        enterActiveClass: 'transition-all duration-200 ease-out',
                        leaveActiveClass: 'transition-all duration-200 ease-out',
                        leaveToClass: 'opacity-0 scale-75 translate-x-0 translate-y-full translate-z-0'
                    }
                    : props.position === 'left' || props.position === 'topleft' || props.position === 'bottomleft'
                        ? {
                            enterFromClass: 'opacity-0 scale-75 -translate-x-full translate-y-0 translate-z-0',
                            enterActiveClass: 'transition-all duration-200 ease-out',
                            leaveActiveClass: 'transition-all duration-200 ease-out',
                            leaveToClass: 'opacity-0 scale-75  -translate-x-full translate-y-0 translate-z-0'
                        }
                        : props.position === 'right' || props.position === 'topright' || props.position === 'bottomright'
                            ? {
                                enterFromClass: 'opacity-0 scale-75 translate-x-full translate-y-0 translate-z-0',
                                enterActiveClass: 'transition-all duration-200 ease-out',
                                leaveActiveClass: 'transition-all duration-200 ease-out',
                                leaveToClass: 'opacity-0 scale-75 opacity-0 scale-75 translate-x-full translate-y-0 translate-z-0'
                            }
                            : {
                                enterFromClass: 'opacity-0 scale-75',
                                enterActiveClass: 'transition-all duration-200 ease-out',
                                leaveActiveClass: 'transition-all duration-200 ease-out',
                                leaveToClass: 'opacity-0 scale-75'
                            };
        }
    },
    button: {
        root: ({props, context}) => ({
            class: [
                'items-center cursor-pointer inline-flex overflow-hidden relative select-none text-center align-bottom',
                'transition duration-200 ease-in-out',
                'focus:outline-none focus:outline-offset-0',
                {
                    'text-white dark:text-gray-900 bg-blue-500 dark:bg-blue-400 border border-blue-500 dark:border-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:border-blue-600 dark:hover:border-blue-500 focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(157,193,251,1),0_1px_2px_0_rgba(0,0,0,1)] dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(147,197,253,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                        !props.link && props.severity === null && !props.text && !props.outlined && !props.plain,
                    'text-blue-600 bg-transparent border-transparent focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(157,193,251,1),0_1px_2px_0_rgba(0,0,0,1)] dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(147,197,253,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                    props.link
                },
                {
                    'focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(176,185,198,1),0_1px_2px_0_rgba(0,0,0,1)] dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(203,213,225,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                        props.severity === 'secondary',
                    'focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(136,234,172,1),0_1px_2px_0_rgba(0,0,0,1)] dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(134,239,172,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                        props.severity === 'success',
                    'focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(157,193,251,1),0_1px_2px_0_rgba(0,0,0,1)] dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(147,197,253,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                        props.severity === 'info',
                    'focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(250,207,133,1),0_1px_2px_0_rgba(0,0,0,1)] dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(252,211,77,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                        props.severity === 'warning',
                    'focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(212,170,251,1),0_1px_2px_0_rgba(0,0,0,1)] dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(216,180,254,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                        props.severity === 'help',
                    'focus:shadow-[0_0_0_2px_rgba(255,255,255,1),0_0_0_4px_rgba(247,162,162,1),0_1px_2px_0_rgba(0,0,0,1)] dark:focus:shadow-[0_0_0_2px_rgba(28,33,39,1),0_0_0_4px_rgba(252,165,165,0.7),0_1px_2px_0_rgba(0,0,0,0)]':
                        props.severity === 'danger'
                },
                {
                    'text-white dark:text-gray-900 bg-gray-500 dark:bg-gray-400 border border-gray-500 dark:border-gray-400 hover:bg-gray-600 dark:hover:bg-gray-500 hover:border-gray-600 dark:hover:border-gray-500':
                        props.severity === 'secondary' && !props.text && !props.outlined && !props.plain,
                    'text-white dark:text-gray-900 bg-green-500 dark:bg-green-400 border border-green-500 dark:border-green-400 hover:bg-green-600 dark:hover:bg-green-500 hover:border-green-600 dark:hover:border-green-500':
                        props.severity === 'success' && !props.text && !props.outlined && !props.plain,
                    'text-white dark:text-gray-900 dark:bg-blue-400 bg-blue-500 dark:bg-blue-400 border border-blue-500 dark:border-blue-400 hover:bg-blue-600 hover:border-blue-600 dark:hover:bg-blue-500 dark:hover:border-blue-500':
                        props.severity === 'info' && !props.text && !props.outlined && !props.plain,
                    'text-white dark:text-gray-900 bg-orange-500 dark:bg-orange-400 border border-orange-500 dark:border-orange-400 hover:bg-orange-600 dark:hover:bg-orange-500 hover:border-orange-600 dark:hover:border-orange-500':
                        props.severity === 'warning' && !props.text && !props.outlined && !props.plain,
                    'text-white dark:text-gray-900 bg-purple-500 dark:bg-purple-400 border border-purple-500 dark:border-purple-400 hover:bg-purple-600 dark:hover:bg-purple-500 hover:border-purple-600 dark:hover:border-purple-500':
                        props.severity === 'help' && !props.text && !props.outlined && !props.plain,
                    'text-white dark:text-gray-900 bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-red-500 hover:border-red-600 dark:hover:border-red-500':
                        props.severity === 'danger' && !props.text && !props.outlined && !props.plain
                },
                {'shadow-lg': props.raised},
                {'rounded-md': !props.rounded, 'rounded-full': props.rounded},
                {
                    'bg-transparent border-transparent': props.text && !props.plain,
                    'text-blue-500 dark:text-blue-400 hover:bg-blue-300/20': props.text && (props.severity === null || props.severity === 'info') && !props.plain,
                    'text-gray-500 dark:text-gray-400 hover:bg-gray-300/20': props.text && props.severity === 'secondary' && !props.plain,
                    'text-green-500 dark:text-green-400 hover:bg-green-300/20': props.text && props.severity === 'success' && !props.plain,
                    'text-orange-500 dark:text-orange-400 hover:bg-orange-300/20': props.text && props.severity === 'warning' && !props.plain,
                    'text-purple-500 dark:text-purple-400 hover:bg-purple-300/20': props.text && props.severity === 'help' && !props.plain,
                    'text-red-500 dark:text-red-400 hover:bg-red-300/20': props.text && props.severity === 'danger' && !props.plain
                },
                {'shadow-lg': props.raised && props.text},
                {
                    'text-gray-500 hover:bg-gray-300/20': props.plain && props.text,
                    'text-gray-500 border border-gray-500 hover:bg-gray-300/20': props.plain && props.outlined,
                    'text-white bg-gray-500 border border-gray-500 hover:bg-gray-600 hover:border-gray-600': props.plain && !props.outlined && !props.text
                },
                {
                    'bg-transparent border': props.outlined && !props.plain,
                    'text-blue-500 dark:text-blue-400 border border-blue-500 dark:border-blue-400 hover:bg-blue-300/20': props.outlined && (props.severity === null || props.severity === 'info') && !props.plain,
                    'text-gray-500 dark:text-gray-400 border border-gray-500 dark:border-gray-400 hover:bg-gray-300/20': props.outlined && props.severity === 'secondary' && !props.plain,
                    'text-green-500 dark:text-green-400 border border-green-500 dark:border-green-400 hover:bg-green-300/20': props.outlined && props.severity === 'success' && !props.plain,
                    'text-orange-500 dark:text-orange-400 border border-orange-500 dark:border-orange-400 hover:bg-orange-300/20': props.outlined && props.severity === 'warning' && !props.plain,
                    'text-purple-500 dark:text-purple-400 border border-purple-500 dark:border-purple-400 hover:bg-purple-300/20': props.outlined && props.severity === 'help' && !props.plain,
                    'text-red-500 dark:text-red-400 border border-red-500 dark:border-red-400 hover:bg-red-300/20': props.outlined && props.severity === 'danger' && !props.plain
                },
                {
                    'px-4 py-3 text-base': props.size === null,
                    'text-xs py-2 px-3': props.size === 'small',
                    'text-xl py-3 px-4': props.size === 'large'
                },
                {'flex-column': props.iconPos == 'top' || props.iconPos == 'bottom'},
                {'opacity-60 pointer-events-none cursor-default': context.disabled}
            ]
        }),
        label: ({props}) => ({
            class: [
                'flex-1',
                'duration-200',
                'font-bold',
                {
                    'hover:underline': props.link
                },
                {'invisible w-0': props.label == null}
            ]
        }),
        icon: ({props}) => ({
            class: [
                'mx-0',
                {
                    'mr-2': props.iconPos == 'left' && props.label != null,
                    'ml-2 order-1': props.iconPos == 'right' && props.label != null,
                    'mb-2': props.iconPos == 'top' && props.label != null,
                    'mt-2 order-2': props.iconPos == 'bottom' && props.label != null
                }
            ]
        }),
        badge: ({props}) => ({
            class: [{'ml-2 w-4 h-4 leading-none flex items-center justify-center': props.badge}]
        })
    },
    toast: {
        root: {
            class: ['w-96', 'opacity-90']
        },
        container: ({props}) => ({
            class: [
                'my-4 rounded-md w-full',
                {
                    'bg-blue-100 border-solid border-0 border-l-4 border-blue-500 text-blue-700': props.message.severity == 'info',
                    'bg-green-100 border-solid border-0 border-l-4 border-green-500 text-green-700': props.message.severity == 'success',
                    'bg-orange-100 border-solid border-0 border-l-4 border-orange-500 text-orange-700': props.message.severity == 'warn',
                    'bg-red-100 border-solid border-0 border-l-4 border-red-500 text-red-700': props.message.severity == 'error'
                }
            ]
        }),
        content: 'flex items-center py-5 px-7',
        icon: {
            class: ['w-6 h-6', 'text-lg mr-2']
        },
        text: 'text-base font-normal flex flex-col flex-1 grow shrink ml-4',
        summary: 'font-bold block',
        detail: 'mt-1 block',
        closebutton: {
            class: ['w-8 h-8 rounded-full bg-transparent transition duration-200 ease-in-out', 'ml-auto overflow-hidden relative', 'flex items-center justify-center', 'hover:bg-white/30']
        },
        transition: {
            enterFromClass: 'opacity-0 translate-x-0 translate-y-2/4 translate-z-0',
            enterActiveClass: 'transition-transform transition-opacity duration-300',
            leaveFromClass: 'max-h-40',
            leaveActiveClass: 'transition-all duration-500 ease-in',
            leaveToClass: 'max-h-0 opacity-0 mb-0 overflow-hidden'
        }
    },
    inputnumber: {
        root: 'w-full inline-flex',
        input: ({props}) => ({
            class: [{'rounded-tr-none rounded-br-none': props.showButtons && props.buttonLayout == 'stacked'}]
        }),
        buttongroup: ({props}) => ({
            class: [{'flex flex-col': props.showButtons && props.buttonLayout == 'stacked'}]
        }),
        incrementbutton: ({props}) => ({
            class: [
                'flex !items-center !justify-center',
                {
                    'rounded-br-none rounded-bl-none rounded-bl-none !p-0 flex-1 w-[3rem]': props.showButtons && props.buttonLayout == 'stacked'
                }
            ]
        }),
        label: 'hidden',
        decrementbutton: ({props}) => ({
            class: [
                'flex !items-center !justify-center',
                {
                    'rounded-tr-none rounded-tl-none rounded-tl-none !p-0 flex-1 w-[3rem]': props.showButtons && props.buttonLayout == 'stacked'
                }
            ]
        })
    },
    textarea: {
        root: ({context}) => ({
            class: [
                'm-0',
                'font-sans text-base text-gray-600 dark:text-white/80 bg-white dark:bg-gray-900 p-3 border border-gray-300 dark:border-blue-900/40 transition-colors duration-200 appearance-none rounded-lg',
                'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                {'opacity-60 select-none pointer-events-none cursor-default': context.disabled}
            ]
        })
    },
    dropdown: {
        root: ({props}) => ({
            class: [
                'cursor-pointer inline-flex relative select-none',
                'bg-white border border-gray-400 transition-colors duration-200 ease-in-out rounded-md',
                'dark:bg-gray-900 dark:border-blue-900/40 dark:hover:border-blue-300',
                'w-full md:w-56',
                'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                {'opacity-60 select-none pointer-events-none cursor-default': props.disabled}
            ]
        }),
        input: ({props}) => ({
            class: [
                'cursor-pointer block flex flex-auto overflow-hidden text-ellipsis whitespace-nowrap relative',
                'bg-transparent border-0 text-gray-800',
                'dark:text-white/80',
                'p-3 transition duration-200 bg-transparent rounded appearance-none font-sans text-base',
                'focus:outline-none focus:shadow-none',
                {'pr-7': props.showClear}
            ]
        }),
        trigger: {
            class: ['flex items-center justify-center shrink-0', 'bg-transparent text-gray-500 w-12 rounded-tr-lg rounded-br-lg']
        },
        wrapper: {
            class: ['max-h-[200px] overflow-auto', 'bg-white text-gray-700 border-0 rounded-md shadow-lg', 'dark:bg-gray-900 dark:text-white/80']
        },
        list: {
            class: 'py-3 list-none m-0'
        },
        item: ({context}) => ({
            class: [
                'cursor-pointer font-normal overflow-hidden relative whitespace-nowrap',
                'm-0 p-3 border-0  transition-shadow duration-200 rounded-none',
                {
                    'text-gray-700 hover:text-gray-700 hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-800': !context.focused && !context.selected,
                    'bg-gray-300 text-gray-700 dark:text-white/80 dark:bg-gray-800/90 hover:text-gray-700 hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-800': context.focused && !context.selected,
                    'bg-blue-100 text-blue-700 dark:bg-blue-400 dark:text-white/80': context.focused && context.selected,
                    'bg-blue-50 text-blue-700 dark:bg-blue-300 dark:text-white/80': !context.focused && context.selected
                }
            ]
        }),
        itemgroup: {
            class: ['m-0 p-3 text-gray-800 bg-white font-bold', 'dark:bg-gray-900 dark:text-white/80', 'cursor-auto']
        },
        header: {
            class: ['p-3 border-b border-gray-300 text-gray-700 bg-gray-100 mt-0 rounded-tl-lg rounded-tr-lg', 'dark:bg-gray-800 dark:text-white/80 dark:border-blue-900/40']
        },
        filtercontainer: {
            class: 'relative'
        },
        filterinput: {
            class: [
                'pr-7 -mr-7',
                'w-full',
                'font-sans text-base text-gray-700 bg-white py-3 px-3 border border-gray-300 transition duration-200 rounded-lg appearance-none',
                'dark:bg-gray-900 dark:border-blue-900/40 dark:hover:border-blue-300 dark:text-white/80',
                'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]'
            ]
        },
        filtericon: {
            class: '-mt-2 absolute top-1/2'
        },
        clearicon: {
            class: 'text-gray-500 right-12 -mt-2 absolute top-1/2'
        },
        transition: TRANSITIONS.overlay
    },
    paginator: {
        root: {
            class: [
                'flex items-center justify-center flex-wrap',
                'bg-white text-gray-500 border-0 px-4 py-2 rounded-md',
                'dark:bg-gray-900 dark:text-white/60 dark:border-blue-900/40' // Dark Mode
            ]
        },
        firstpagebutton: ({context}) => ({
            class: [
                'relative inline-flex items-center justify-center user-none overflow-hidden leading-none',
                'border-0 text-gray-500  min-w-[3rem] h-12 m-[0.143rem] rounded-md',
                'transition duration-200',
                'dark:text-white', //Dark Mode
                {
                    'cursor-default pointer-events-none opacity-60': context.disabled,
                    'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]': !context.disabled // Focus
                }
            ]
        }),
        previouspagebutton: ({context}) => ({
            class: [
                'relative inline-flex items-center justify-center user-none overflow-hidden leading-none',
                'border-0 text-gray-500 min-w-[3rem] h-12 m-[0.143rem] rounded-md',
                'transition duration-200',
                'dark:text-white', //Dark Mode
                {
                    'cursor-default pointer-events-none opacity-60': context.disabled,
                    'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]': !context.disabled // Focus
                }
            ]
        }),
        nextpagebutton: ({context}) => ({
            class: [
                'relative inline-flex items-center justify-center user-none overflow-hidden leading-none',
                'border-0 text-gray-500 min-w-[3rem] h-12 m-[0.143rem] rounded-md',
                'transition duration-200',
                'dark:text-white', //Dark Mode
                {
                    'cursor-default pointer-events-none opacity-60': context.disabled,
                    'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]': !context.disabled // Focus
                }
            ]
        }),
        lastpagebutton: ({context}) => ({
            class: [
                'relative inline-flex items-center justify-center user-none overflow-hidden leading-none',
                'border-0 text-gray-500 min-w-[3rem] h-12 m-[0.143rem] rounded-md',
                'transition duration-200',
                'dark:text-white', //Dark Mode
                {
                    'cursor-default pointer-events-none opacity-60': context.disabled,
                    'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]': !context.disabled // Focus
                }
            ]
        }),
        pagebutton: ({context}) => ({
            class: [
                'relative inline-flex items-center justify-center user-none overflow-hidden leading-none',
                'border-0 text-gray-500 min-w-[3rem] h-12 m-[0.143rem] rounded-md',
                'transition duration-200',
                'dark:border-blue-300 dark:text-white', // Dark Mode
                'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]', // Focus
                {
                    'bg-blue-50 border-blue-50 text-blue-700 dark:bg-blue-300': context.active
                }
            ]
        }),
        rowperpagedropdown: {
            root: ({props, state}) => ({
                class: [
                    'inline-flex relative cursor-pointer user-none',
                    'bg-white border rounded-md',
                    'transition duration-200',
                    'h-12 mx-2',
                    'dark:bg-gray-950 dark:border-blue-900/40', //DarkMode
                    {
                        'outline-none outline-offset-0 shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] border-blue-500': state.focused && !props.disabled, //Focus
                        'border-gray-300': !state.focused,
                        'hover:border-blue-500': !props.disabled //Hover
                    }
                ]
            }),
            input: {
                class: [
                    'font-sans text-base text-gray-600 p-3 m-0 rounded-md apperance-none',
                    'block whitespace-nowrap overflow-hidden flex-auto w-[1%] cursor-pointer text-ellipsis border-0 pr-0',
                    'focus:outline-none focus:outline-offset-0',
                    'dark:text-white' //Dark Mode
                ]
            },
            trigger: {
                class: ['flex items-center justify-center shrink-0', 'text-gray-500 dark:text-white w-12 rounded-r-md']
            },
            panel: {
                class: [
                    'bg-white text-gray-600 border-0 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.1)]',
                    'dark:bg-gray-900 dark:text-white/80 dark:border-blue-900/40' //Dark Mode
                ]
            },
            wrapper: 'overflow-auto',
            list: 'm-0 p-0 py-3 list-none',
            item: ({context}) => ({
                class: [
                    'relative font-normal cursor-pointer space-nowrap overflow-hidden',
                    'm-0 py-3 px-5 border-none text-gray-600 rounded-none',
                    'transition duration-200',
                    'dark:text-white/80', // Dark Mode
                    {
                        'text-blue-700 bg-blue-50 dark:text-white/80 dark:bg-blue-300': !context.focused && context.selected,
                        'bg-blue-300/40': context.focused && context.selected,
                        'text-gray-600 bg-gray-300 dark:text-white/80 dark:bg-blue-900/40': context.focused && !context.selected
                    }
                ]
            })
        },
        jumptopageinput: {
            root: 'inline-flex mx-2',
            input: {
                class: [
                    'font-sans text-base text-gray-600 p-3 m-0 rounded-md apperance-none',
                    'block whitespace-nowrap overflow-hidden flex-auto w-[1%] cursor-pointer text-ellipsis border border-gray-300 pr-0',
                    'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] focus:border-blue-300',
                    'dark:text-white dark:bg-gray-950 dark:border-blue-900/40', //Dark Mode
                    'm-0 flex-auto max-w-[3rem]'
                ]
            }
        },
        jumptopagedropdown: {
            root: ({props, state}) => ({
                class: [
                    'inline-flex relative cursor-pointer user-none',
                    'bg-white border rounded-md',
                    'transition duration-200',
                    'h-12 mx-2',
                    'dark:bg-gray-950 dark:border-blue-900/40', //DarkMode
                    {
                        'outline-none outline-offset-0 shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] border-blue-500': state.focused && !props.disabled, //Focus
                        'border-gray-300': !state.focused,
                        'hover:border-blue-500': !props.disabled //Hover
                    }
                ]
            }),
            input: {
                class: [
                    'font-sans text-base text-gray-600 p-3 m-0 rounded-md apperance-none',
                    'block whitespace-nowrap overflow-hidden flex-auto w-[1%] cursor-pointer text-ellipsis border-0 pr-0',
                    'focus:outline-none focus:outline-offset-0',
                    'dark:text-white' //Dark Mode
                ]
            },
            trigger: {
                class: ['flex items-center justify-center shrink-0', 'text-gray-500 dark:text-white w-12 rounded-r-md']
            },
            panel: {
                class: [
                    'bg-white text-gray-600 border-0 rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.1)]',
                    'dark:bg-gray-900 dark:text-white/80 dark:border-blue-900/40' //Dark Mode
                ]
            },
            wrapper: 'overflow-auto',
            list: 'm-0 p-0 py-3 list-none',
            item: ({context}) => ({
                class: [
                    'relative font-normal cursor-pointer space-nowrap overflow-hidden',
                    'm-0 py-3 px-5 border-none text-gray-600 rounded-none',
                    'transition duration-200',
                    'dark:text-white/80', // Dark Mode
                    {
                        'text-blue-700 bg-blue-50 dark:text-white/80 dark:bg-blue-300': !context.focused && context.selected,
                        'bg-blue-300/40': context.focused && context.selected,
                        'text-gray-600 bg-gray-300 dark:text-white/80 dark:bg-blue-900/40': context.focused && !context.selected
                    }
                ]
            })
        }
    },
    multiselect: {
        root: ({props}) => ({
            class: [
                'inline-flex cursor-pointer select-none',
                'bg-white dark:bg-gray-900 border border-gray-400 dark:border-blue-900/40  transition-colors duration-200 ease-in-out rounded-md',
                'w-full md:w-80',
                {'opacity-60 select-none pointer-events-none cursor-default': props?.disabled}
            ]
        }),
        labelContainer: {
            class: 'overflow-hidden flex flex-auto cursor-pointer'
        },
        label: ({props}) => ({
            class: [
                'block overflow-hidden whitespace-nowrap cursor-pointer text-ellipsis',
                'text-gray-800 dark:text-white/80',
                'p-3 transition duration-200',
                {
                    '!p-3': props.display !== 'chip' && (props?.modelValue == null || props?.modelValue == undefined),
                    '!py-1.5 px-3': props.display == 'chip' && props?.modelValue !== null,
                    '!p-3': props.display == 'chip' && props?.modelValue == null
                }
            ]
        }),
        token: {
            class: ['py-1 px-2 mr-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white/80 rounded-full', 'cursor-default inline-flex items-center']
        },
        removeTokenIcon: {
            class: 'ml-2'
        },
        trigger: {
            class: ['flex items-center justify-center shrink-0', 'bg-transparent text-gray-600 dark:text-white/70 w-12 rounded-tr-lg rounded-br-lg']
        },
        panel: {
            class: ['bg-white dark:bg-gray-900 text-gray-700 dark:text-white/80 border-0 rounded-md shadow-lg']
        },
        header: {
            class: ['p-3 border-b border-gray-300 dark:border-blue-900/40 text-gray-700 dark:text-white/80 bg-gray-100 dark:bg-gray-800 rounded-t-lg', 'flex items-center justify-between']
        },
        headerCheckboxContainer: {
            class: ['inline-flex cursor-pointer select-none align-bottom relative', 'mr-2', 'w-6 h-6']
        },
        headerCheckbox: ({context}) => ({
            class: [
                'flex items-center justify-center',
                'border-2 w-6 h-6 text-gray-600 dark:text-white/70 rounded-lg transition-colors duration-200',
                'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                {
                    'border-gray-300 dark:border-blue-900/40 bg-white dark:bg-gray-900': !context?.selected,
                    'border-blue-500 bg-blue-500': context?.selected
                }
            ]
        }),
        headercheckboxicon: {
            class: 'w-4 h-4 transition-all duration-200 text-white text-base'
        },
        closeButton: {
            class: [
                'flex items-center justify-center overflow-hidden relative',
                'w-8 h-8 text-gray-500 dark:text-white/70 border-0 bg-transparent rounded-full transition duration-200 ease-in-out mr-2 last:mr-0',
                'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 ',
                'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]'
            ]
        },
        closeButtonIcon: {
            class: 'w-4 h-4 inline-block'
        },
        wrapper: {
            class: ['max-h-[200px] overflow-auto', 'bg-white text-gray-700 border-0 rounded-md shadow-lg', 'dark:bg-gray-900 dark:text-white/80']
        },
        list: {
            class: 'py-3 list-none m-0'
        },
        item: ({context}) => ({
            class: [
                'cursor-pointer font-normal overflow-hidden relative whitespace-nowrap',
                'm-0 p-3 border-0  transition-shadow duration-200 rounded-none',
                {
                    'text-gray-700 hover:text-gray-700 hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-800': !context.focused && !context.selected,
                    'bg-gray-300 text-gray-700 dark:text-white/80 dark:bg-gray-800/90 hover:text-gray-700 hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-800': context.focused && !context.selected,
                    'bg-blue-100 text-blue-700 dark:bg-blue-400 dark:text-white/80': context.focused && context.selected,
                    'bg-blue-50 text-blue-700 dark:bg-blue-300 dark:text-white/80': !context.focused && context.selected
                }
            ]
        }),
        checkboxContainer: {
            class: ['inline-flex cursor-pointer select-none align-bottom relative', 'mr-2', 'w-6 h-6']
        },
        checkbox: ({context}) => ({
            class: [
                'flex items-center justify-center',
                'border-2 w-6 h-6 text-gray-600 dark:text-white/80 rounded-lg transition-colors duration-200',
                'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                {
                    'border-gray-300 dark:border-blue-900/40  bg-white dark:bg-gray-900': !context?.selected,
                    'border-blue-500 bg-blue-500': context?.selected
                }
            ]
        }),
        checkboxicon: {
            class: 'w-4 h-4 transition-all duration-200 text-white text-base'
        },
        itemgroup: {
            class: ['m-0 p-3 text-gray-800 bg-white font-bold', 'dark:bg-gray-900 dark:text-white/80', 'cursor-auto']
        },
        filtercontainer: {
            class: 'relative'
        },
        filterinput: {
            class: [
                'pr-7 -mr-7',
                'w-full',
                'font-sans text-base text-gray-700 bg-white py-3 px-3 border border-gray-300 transition duration-200 rounded-lg appearance-none',
                'dark:bg-gray-900 dark:border-blue-900/40 dark:hover:border-blue-300 dark:text-white/80',
                'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]'
            ]
        },
        filtericon: {
            class: '-mt-2 absolute top-1/2'
        },
        clearicon: {
            class: 'text-gray-500 right-12 -mt-2 absolute top-1/2'
        },
        transition: TRANSITIONS.overlay
    },
    calendar: {
        root: ({props}) => ({
            class: [
                'inline-flex max-w-full relative',
                {
                    'opacity-60 select-none pointer-events-none cursor-default': props.disabled
                }
            ]
        }),
        input: {
            class: [
                'font-sans text-base text-gray-600 dark:text-white/80 bg-white dark:bg-gray-900 p-3 border border-gray-300 dark:border-blue-900/40 transition-colors duration-200 appearance-none rounded-lg',
                'hover:border-blue-500' //Hover
            ]
        },
        panel: ({props}) => ({
            class: [
                'bg-white dark:bg-gray-900',
                'min-w-[350px]',
                {
                    'shadow-md border-0 absolute': !props.inline,
                    'inline-block overflow-x-auto border border-gray-300 dark:border-blue-900/40 p-2 rounded-lg': props.inline
                }
            ]
        }),
        header: {
            class: ['flex items-center justify-between', 'p-2 text-gray-700 dark:text-white/80 bg-white dark:bg-gray-900 font-semibold m-0 border-b border-gray-300 dark:border-blue-900/40 rounded-t-lg']
        },
        previousbutton: {
            class: [
                'flex items-center justify-center cursor-pointer overflow-hidden relative',
                'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
                'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 '
            ]
        },
        title: 'leading-8 mx-auto',
        monthTitle: {
            class: ['text-gray-700 dark:text-white/80 transition duration-200 font-semibold p-2', 'mr-2', 'hover:text-blue-500']
        },
        yearTitle: {
            class: ['text-gray-700 dark:text-white/80 transition duration-200 font-semibold p-2', 'hover:text-blue-500']
        },
        nextbutton: {
            class: [
                'flex items-center justify-center cursor-pointer overflow-hidden relative',
                'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
                'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 '
            ]
        },
        table: {
            class: ['border-collapse w-full', 'my-2']
        },
        tableheadercell: 'p-2',
        weekday: 'text-gray-600 dark:text-white/70',
        day: 'p-2',
        daylabel: ({context}) => ({
            class: [
                'w-10 h-10 rounded-full transition-shadow duration-200 border-transparent border',
                'flex items-center justify-center mx-auto overflow-hidden relative',
                'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                {
                    'opacity-60 cursor-default': context.disabled,
                    'cursor-pointer': !context.disabled
                },
                {
                    'text-gray-600 dark:text-white/70 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80': !context.selected && !context.disabled,
                    'text-blue-700 bg-blue-100 hover:bg-blue-200': context.selected && !context.disabled
                }
            ]
        }),
        monthpicker: 'my-2',
        month: ({context}) => ({
            class: [
                'w-1/3 inline-flex items-center justify-center cursor-pointer overflow-hidden relative',
                'p-2 transition-shadow duration-200 rounded-lg',
                'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                {
                    'text-gray-600 dark:text-white/70 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80': !context.selected && !context.disabled,
                    'text-blue-700 bg-blue-100 hover:bg-blue-200': context.selected && !context.disabled
                }
            ]
        }),
        yearpicker: {
            class: ['my-2']
        },
        year: ({context}) => ({
            class: [
                'w-1/2 inline-flex items-center justify-center cursor-pointer overflow-hidden relative',
                'p-2 transition-shadow duration-200 rounded-lg',
                'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                {
                    'text-gray-600 dark:text-white/70 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80': !context.selected && !context.disabled,
                    'text-blue-700 bg-blue-100 hover:bg-blue-200': context.selected && !context.disabled
                }
            ]
        }),
        timepicker: {
            class: ['flex justify-center items-center', 'border-t-1 border-solid border-gray-300 p-2']
        },
        separatorcontainer: 'flex items-center flex-col px-2',
        separator: 'text-xl',
        hourpicker: 'flex items-center flex-col px-2',
        minutepicker: 'flex items-center flex-col px-2',
        ampmpicker: 'flex items-center flex-col px-2',
        incrementbutton: {
            class: [
                'flex items-center justify-center cursor-pointer overflow-hidden relative',
                'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
                'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 '
            ]
        },
        decrementbutton: {
            class: [
                'flex items-center justify-center cursor-pointer overflow-hidden relative',
                'w-8 h-8 text-gray-600 dark:text-white/70 border-0 bg-transparent rounded-full transition-colors duration-200 ease-in-out',
                'hover:text-gray-700 dark:hover:text-white/80 hover:border-transparent hover:bg-gray-200 dark:hover:bg-gray-800/80 '
            ]
        },
        groupcontainer: 'flex',
        group: {
            class: ['flex-1', 'border-l border-gray-300 pr-0.5 pl-0.5 pt-0 pb-0', 'first:pl-0 first:border-l-0']
        },
        transition: TRANSITIONS.overlay
    },
    steps: {
        root: 'relative',
        menu: 'p-0 m-0 list-none flex',
        menuitem: {
            class: ['relative flex justify-center flex-1 overflow-hidden', 'before:border-t before:border-gray-300 before:dark:border-blue-900/40 before:w-full before:absolute before:top-1/4 before:left-0 before:transform before:-translate-y-1/2']
        },
        action: {
            class: [
                'inline-flex flex-col items-center overflow-hidden',
                'transition-shadow rounded-md bg-white dark:bg-transparent',
                'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]'
            ]
        },
        step : ({context}) => ({
            class: ['flex items-center justify-center',
                context.active ? 'text-white dark:text-white/80 border border-green-300 dark:border-blue-900/40 bg-green-500 dark:bg-green-900 w-[2rem] h-[2rem] leading-2rem text-sm z-10 rounded-full' : 'text-gray-700 dark:text-white/80 border border-gray-300 dark:border-blue-900/40 bg-white dark:bg-gray-900 w-[2rem] h-[2rem] leading-2rem text-sm z-10 rounded-full']
        }),
        label : ({context}) => ({
            class: ['block',
                'whitespace-nowrap overflow-hidden overflow-ellipsis max-w-full mt-2',
                context.active ? 'text-green-500 dark:text-white/80 font-bold' : 'text-gray-700 dark:text-white/80']
        })
    },
    card: {
        root: {
            class: [
                'bg-white text-gray-700 shadow-md rounded-md', // Background, text color, box shadow, and border radius.
                'dark:bg-gray-900 dark:text-white ' //dark
            ]
        },
        body: 'p-5', // Padding.
        title: 'text-2xl font-bold mb-2', // Font size, font weight, and margin bottom.
        subtitle: {
            class: [
                'font-normal mb-2 text-gray-600', // Font weight, margin bottom, and text color.
                'dark:text-white/60 ' //dark
            ]
        },
        content: 'py-5', // Vertical padding.
        footer: 'pt-5' // Top padding.
    },
    fieldset: {
        root: {
            class: [
                'border border-gray-300 bg-white text-gray-700 rounded-md block mx-2 my-0.5 pl-4 pr-5 inline-size-min', // Borders, background, text color, spacing, and inline size.
                'dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80' //dark
            ]
        },
        legend: ({ props }) => ({
            class: [
                'border border-gray-300 text-gray-700 bg-gray-50 font-bold rounded-md',
                'dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80 ', //dark
                {
                    'p-0 transition-none hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900 dark:hover:text-white/80 dark:hover:bg-gray-800/80 dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]': props.toggleable,
                    'p-5': !props.toggleable
                }
            ]
        }),
        toggler: ({ props }) => ({
            class: [
                'flex items-center justify-center',
                {
                    'p-5 text-gray-700 rounded-md transition-none cursor-pointer overflow-hidden relative select-none hover:text-gray-900 focus:focus:shadow-[inset_0_0_0_0.2rem_rgba(191,219,254,1)] dark:text-white/80 dark:hover:text-white/80 dark:hover:bg-gray-800/60 dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]':
                    props.toggleable
                }
            ]
        }),
        togglerIcon: 'mr-2 inline-block', // Margin and display style.
        legendTitle: 'flex items-center justify-center leading-none', // alignments, and leading style.
        content: 'p-5', // Padding.
        transition: TRANSITIONS.toggleable
    },
    avatar: {
        root: ({props:e,parent:r})=>{var t,o,i;return{class:[{"text-xl":e.size=="large","text-2xl":e.size=="xlarge"},"inline-flex items-center justify-center","relative",{"h-8 w-8":e.size==null||e.size=="normal","w-12 h-12":e.size=="large","w-16 h-16":e.size=="xlarge"},{"-ml-4":((t=r.instance.$style)==null?void 0:t.name)=="avatargroup"},{"rounded-lg":e.shape=="square","rounded-full":e.shape=="circle"},{"border-2":((o=r.instance.$style)==null?void 0:o.name)=="avatargroup"},"bg-surface-300 dark:bg-surface-700",{"border-white dark:border-surface-800":((i=r.instance.$style)==null?void 0:i.name)=="avatargroup"}]}},
        image: {
            class: "h-full w-full"
        }
    },
    overlaypanel: {
        root: {
            class: ["rounded-md shadow-lg", "border-0 dark:border", "absolute left-0 top-0 mt-2", "z-40 transform origin-center", "bg-surface-0 dark:bg-surface-800", "text-surface-700 dark:text-surface-0/80", "dark:border-surface-700", "before:absolute before:-top-2 before:ml-4", "before:w-0 before:h-0", "before:border-transparent before:border-solid", "before:border-x-[0.5rem] before:border-b-[0.5rem]", "before:border-t-0 before:border-b-surface-0 dark:before:border-b-surface-800"]
        },
        content: {
            class: "p-5 items-center flex"
        },
        transition: {
            enterFromClass: "opacity-0 scale-y-[0.8]",
            enterActiveClass: "transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]",
            leaveActiveClass: "transition-opacity duration-100 ease-linear",
            leaveToClass: "opacity-0"
        }
    }
}

export default MyDesignSystem;