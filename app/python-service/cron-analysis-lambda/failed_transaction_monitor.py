from dynamo_storage import check_failed_transactions

# Update failed transactions and trigger alert if cumulative failures exceed a threshold
def update_failed_transactions(processed_results):
    for result in processed_results:
        if result['transaction']['alert_status'] == "high" or result['transaction']['alert_status'] == "medium":
            # Fetch failed transaction history from DynamoDB
            contract_address = result['transaction']['contract']
            failed_transactions = check_failed_transactions(contract_address)

            # If more than X failed transactions, raise alert
            if len(failed_transactions) > 3:  # Example threshold
                result['transaction']['alert_status'] = "high"
                result['transaction']['analysis'] += " | Multiple failed transactions detected"
