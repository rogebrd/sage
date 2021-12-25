class Transaction:

    def __init__(self, id, entries, date):
        self.id = id
        self.entries = entries
        self.date = date
    
    def __str__(self):
        return "{} [entries:{}, date:{}]".format(self.id, self.entries, self.date)

    def from_dynamodb(dynamo_entry):
        return Transaction(
            id=dynamo_entry['AccountId']['S'],
            entries=dynamo_entry['EntryIds']['SS'],
            date=dynamo_entry['Date']['N']
        )
    