def device_risk(device_id, known_devices):

    if device_id in known_devices:
        return 0.1

    return 0.8