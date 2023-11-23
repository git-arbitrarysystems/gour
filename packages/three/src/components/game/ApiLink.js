import { isEqual } from 'lodash'
class ApiLink {
    constructor(onDataChange) {
        this.onDataChange = onDataChange;
        this.create()
    }


    get data() { return this.this._data }
    set data(data) {
        if (!isEqual(data, this._data)) {
            this._data = data;
            if (this.onDataChange) this.onDataChange(data)
        }
    }



    create() {
        fetch('/api/create',
            { method: 'POST' })
            .then(response => response.json())
            .then(data => this.data = data)
    }

    delete() {
        fetch('/api/delete',
            { method: 'POST' })
            .then(response => response.json())
            .then(data => this.data = data)
    }

    action(type, value) {
        fetch('/api/action',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ type, value })
            })
            .then(response => response.json())
            .then(data => this.data = data)
    }

}

export { ApiLink }