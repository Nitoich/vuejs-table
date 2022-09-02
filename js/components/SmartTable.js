export default {
    name: 'SmartTable',
    data() {
        return {
            selectedRows: []
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
        }
    },
    methods: {
        mouseEnterInRow(event, indexElement) {

        },
        mouseLeaveInRow(event, indexElement) {

        },
        selectRow(event, indexElement) {
            if(this.canSelectRow) {
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
                        this.selectedRows.push(Object.assign(this.rows[indexElement], {_i: indexElement}));
                    }
                    element.children[0].children[0].checked = !element.children[0].children[0].checked;
                    this.$emit('update:selectedRows', this.selectedRows);
                    this.$emit('afterSelectRow', this.selectedRows);


                } else {
                    let elements = this.$refs.TableRows;
                    elements.forEach(el => {
                        el.children[0].children[0].checked = false;
                    });

                    if(this.selectedRows._i != undefined && this.selectedRows._i == indexElement) {
                        this.selectedRows = [];
                        elements[indexElement].children[0].children[0].checked = false;
                    } else {
                        elements[indexElement].children[0].children[0].checked = true;
                        this.selectedRows = this.rows[indexElement];
                    }
                    this.$emit('update:selectedRows', Object.assign(this.selectedRows, {_i: indexElement}));
                    this.$emit('afterSelectRow', Object.assign(this.selectedRows, {_i: indexElement}));
                }
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
                <tr ref="TableRows" @click="this.selectRow($event, index)" @mouseleave="this.mouseLeaveInRow($event, index)" @mouseenter="this.mouseEnterInRow($event, index)" v-for="(row, index) in this.rows" style="cursor: pointer; border-collapse: collapse; border: 2px solid rgb(127,127,127);">
                    <th v-if="this.canSelectRow" style="padding: 0 10px; border: 1px solid #AAAAAA; background: #AAAAAA;">
                        <input type="checkbox" disabled>
                    </th>
                    <th v-for="(column, key) in this.columns" style="padding: 10px; border: 1px solid #AAAAAA; background: rgba(200,200,200, 1)">
                        {{ row[key] }}
                    </th>
                </tr>
            </tbody>
        </table>
    `
}