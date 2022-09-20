// TODO: Сдлеать action панель для всех выбранных строк

export default {
    name: 'SmartTable',
    data() {
        return {
            selectedRows: [],
            actionPanel: undefined,
            items: []
        }
    },
    props: {
        columns: {
            type: Object,
            default: {}
        },
        rows: {
            type: Array,
            default: []
        },
        canSelectRow: {
            type: Boolean,
            default: true
        },
        multipleSelect: {
            type: Boolean,
            default: true
        },
        stickyHeader: {
            type: Boolean,
            default: true
        },
        actionPanelRow: {
            type: Array,
            default: []
        },
        originDataUrl: {
            default: false
        }
    },
    mounted() {
        console.log(this.originDataUrl)
        if(this.originDataUrl) {
            fetch(this.originDataUrl, {
                method: 'get',
                credentials: 'include'
            })
                .then(res => res.json())
                .then(res => {
                    this.items = res;
                })
        } else {
            this.items = this.rows;
        }
    },
    watch: {
        rows: function() {
            if(this.originDataUrl == false) {
                this.items = this.rows
            }
        }
    },
    methods: {
        refreshData() {
            this.items = [];
            if(this.originDataUrl) {
                fetch(this.originDataUrl, {
                    method: 'get',
                    credentials: 'include'
                })
                    .then(res => res.json())
                    .then(res => {
                        this.items = res;
                    })
            }
        },
        selectRow(event, indexElement) {
            const tmp = event.composedPath().includes(this.actionPanel);
            if(this.canSelectRow && event.button == 0 && !tmp) {
                if (this.multipleSelect) {

                    let element = this.$refs.TableRows[indexElement];
                    let check = element.children[0].children[0].checked;
                    if(check){
                        if(this.selectedRows.length != 0){
                            let elementInSelect = -1;

                            for(let i = 0; i < this.selectedRows.length - 1; i++){
                                if(this.selectedRows[i]._i == indexElement) {
                                    elementInSelect = i;
                                    break;
                                }
                            }

                            this.selectedRows.splice(elementInSelect, 1);

                        }
                    } else {
                        this.selectedRows.push(Object.assign(this.items[indexElement], {_i: indexElement}));
                    }
                    element.children[0].children[0].checked = !element.children[0].children[0].checked;
                    this.$emit('update:selectedRows', this.selectedRows);
                    this.$emit('afterSelectRow', this.selectedRows);


                } else {
                    let elements = this.$refs.TableRows;
                    elements.forEach(el => {
                        el.children[0].children[0].checked = false;
                    });

                    if(this.selectedRows._i == indexElement) {
                        this.selectedRows = {};
                        elements[indexElement].children[0].children[0].checked = false;
                        this.$emit('update:selectedRows', this.selectedRows);
                        this.$emit('afterSelectRow', this.selectedRows);
                    } else {
                        elements[indexElement].children[0].children[0].checked = true;
                        this.selectedRows = this.items[indexElement];
                        this.$emit('update:selectedRows', Object.assign(this.selectedRows, {_i: indexElement}));
                        this.$emit('afterSelectRow', Object.assign(this.selectedRows, {_i: indexElement}));
                    }
                }
            }
        },
        disableBrowserContentMenu(event, indexElement) {
            if(this.actionPanelRow.length != 0) {
                event.preventDefault();
                if(typeof this.actionPanel != 'undefined') {
                    this.actionPanel.remove();
                    this.actionPanel = undefined;
                }
                this.actionPanel = document.createElement('div');
                this.actionPanel.style.cssText = `
                    width: 100px;
                    padding: 10px;
                    background: #FFFFFF;
                    border: 1px solid #000000;
                    position: absolute;
                `;

                this.actionPanelRow.forEach(el => {
                    let button = document.createElement('button');
                    button.innerHTML = el.title;
                    button.style.cssText = `
                        width: 100%;
                    `
                    button.onclick = () => {
                        el.cb(Object.assign(this.items[indexElement], {_i: indexElement}), this.refreshData);
                        this.actionPanel.remove();
                        this.actionPanel = undefined;
                    }
                    this.actionPanel.append(button)
                });

                this.actionPanel.style.left = `${event.pageX}px`;
                this.actionPanel.style.top = `${event.pageY}px`;

                let checker = (event) => {
                    if(this.actionPanel) {
                        const tmp = event.composedPath().includes(this.actionPanel);
                        if(!tmp){
                            this.actionPanel.remove();
                            this.actionPanel = undefined;
                            document.removeEventListener('click', checker)
                        }
                    }

                }

                document.addEventListener('click', checker)

                this.$refs.TableRows[indexElement].append(this.actionPanel);
            }
        }
    },
    template: `
        <table style="border: 1px solid #AAAAAA; min-width: 100%;" cellspacing="0">
            <thead>
                <tr style="background: #FFFFFF" :style="this.stickyHeader ? 'position: sticky; top: 0px;' : ''">
                    <th v-if="this.canSelectRow" style="border: 1px solid #AAAAAA;"></th>
                    <th v-for="column in this.columns" style="padding: 10px; border: 1px solid #AAAAAA;">
                        {{ column }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr @contextmenu="this.disableBrowserContentMenu($event, index)" ref="TableRows" @mousedown="this.selectRow($event, index)" v-for="(row, index) in this.items" style="cursor: pointer; border-collapse: collapse; border: 2px solid rgb(127,127,127);">
                    <th v-if="this.canSelectRow" style="padding: 0 10px; border: 1px solid #AAAAAA; background: #AAAAAA;">
                        <input type="checkbox" disabled>
                    </th>
                    <th v-html="row[key]" v-for="(column, key) in this.columns" style="padding: 10px; border: 1px solid #AAAAAA; background: rgba(200,200,200, 1)">
                    
                    </th>
                </tr>
            </tbody>
        </table>
    `
}