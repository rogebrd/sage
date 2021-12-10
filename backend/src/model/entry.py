class Entry:

    def __init__(self, id, account_id, style, amount, date, category, tags, description):
        self.id = id
        self.account_id = account_id
        self.style = style
        self.amount = amount
        self.date = date
        self.category = category
        self.tags = tags
        self.description = description

    def from_dynamodb(dynamo_entry):
        return Entry(
            id=dynamo_entry['EntryId']['S'],
            account_id=dynamo_entry['AccountId']['S'],
            style=dynamo_entry['Style']['S'],
            amount=dynamo_entry['Amount']['S'],
            date=dynamo_entry['Date']['N'],
            category=dynamo_entry['Category']['S'],
            tags=dynamo_entry.get('Tags', {}).get('SS'),
            description=dynamo_entry.get('Description', {}).get('S')
        )