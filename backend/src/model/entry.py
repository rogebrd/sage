import json


class Entry:
    def __init__(
        self,
        id,
        account_id,
        transaction_id,
        style,
        amount,
        date,
        category,
        tags,
        description,
    ):
        self.id = id
        self.account_id = account_id
        self.transaction_id = transaction_id
        self.style = style
        self.amount = amount
        self.date = date
        self.category = category
        self.tags = tags
        self.description = description

    def to_json(self):
        return {
            "id": self.id,
            "account_id": self.account_id,
            "style": self.style,
            "amount": self.amount,
            "date": self.date,
            "category": self.category,
            "tags": self.tags,
            "description": self.description,
        }

    def from_dynamodb(dynamo_entry):
        entry_amount = dynamo_entry["Amount"]["S"]
        try:
            entry_amount = float(entry_amount)
        except:
            # If float conversion fails then amount is stock amount
            # ensure all double quotes
            escaped_amount = entry_amount.replace("'", '"')
            entry_amount = json.loads(escaped_amount)
        return Entry(
            id=dynamo_entry["EntryId"]["S"],
            account_id=dynamo_entry["AccountId"]["S"],
            transaction_id=dynamo_entry["TransactionId"]["S"],
            style=dynamo_entry["Style"]["S"],
            amount=entry_amount,
            date=dynamo_entry["Date"]["N"],
            category=dynamo_entry["Category"]["S"],
            tags=dynamo_entry.get("Tags", {}).get("SS"),
            description=dynamo_entry.get("Description", {}).get("S"),
        )
