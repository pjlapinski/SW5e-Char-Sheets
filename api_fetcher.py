import requests
import json
import os
from time import sleep


def get_targets():
    """Available targets for fetching (there are more in the API, these are the only ones we're
    going to be using)."""

    return [
        'species',
        'classes',
        'archetypes',
        'backgrounds',
        'feats',
        'powers',
        'equipment'
    ]


def dump_to_json(target):
    """Fetches the target file from the API and puts it into a json file."""

    targets = {
        'species': 'https://sw5eapi.azurewebsites.net/api/Species',
        'classes': 'https://sw5eapi.azurewebsites.net/api/Class',
        'archetypes': 'https://sw5eapi.azurewebsites.net/api/Archetype',
        'backgrounds': 'https://sw5eapi.azurewebsites.net/api/Background',
        'feats': 'https://sw5eapi.azurewebsites.net/api/Feat',
        'powers': 'https://sw5eapi.azurewebsites.net/api/Power',
        'equipment': 'https://sw5eapi.azurewebsites.net/api/Equipment'
    }
    url = targets[target]
    result = requests.get(url)
    print(f'Trying to dump "{target}" to json')
    if result.ok:
        if os.path.isfile(f'./json/{target}.json'):
            print(f'Removing the old {target} file')
            os.remove(f'./json/{target}.json')
        result_json = result.json()
        with open(f'./json/{target}.json', 'w') as f:
            relevant_info = clean_up_json(result_json)
            json.dump(relevant_info, f, indent=4, ensure_ascii=False)
        print('Done dumping json to the file')
    else:
        print(
            f'Could not connect to the website, status code = {result.status_code}\n')
    return result


def clean_up_json(source):
    """Fixes odd problems that the fetched json files have."""

    def strip(s):
        """Helper function, which formats numbers nicely, i.e. 3rd -> 3."""

        return s.strip('st').strip('rd').strip('th').strip('nd')

    relevant_info = []
    for data in source:
        info = {}
        for key, value in data.items():
            if isinstance(value, str):
                if 'Tr�kata' in value:
                    value = value.replace('�', 'à')
                elif 'Ter�s K�si' in value:
                    value = value.replace('�', 'ä')
                elif 'name' in info.keys():
                    if info['name'] == 'Experimental Engineering':
                        value = value.replace('�', ' ')
                    elif info['name'] == 'Frenzied Approach':
                        value = value.replace('�', '-')
            elif key == 'levelChanges':
                for _, value_ in value.items():
                    for key_, val in value_.items():
                        if '�' in val:
                            value_[key_] = '-'
            # Getting rid of unnecessary fields
            if 'Json' not in key and 'Enum' not in key and key != 'rowKey' and key != 'timestamp' and key != 'eTag' and key != 'contentType' and key != 'partitionKey' and 'Parsed' not in key and key != 'speed' and key != 'contentSource' and key != 'imageUrls':
                info[key] = value
        # aka if we're working with Classes
        if 'levelChanges' in info.keys():
            features_list = []
            for level, info_ in info['levelChanges'].items():
                features = info_['Features'].split(',')
                for feature in features:
                    feature = feature.replace(
                        '(d6)', '').replace('(1 die)', '')
                    feature = feature.replace(
                        '(one use)', '').replace('(long rest)', '')
                    feature = feature.strip()
                    if feature not in features_list:
                        features_list.append(feature)
            # Adding the features
            features = info['classFeatureText']
            if info['classFeatureText2']:
                features += info['classFeatureText2']
            # we're going to handle archetypes separately, so let's just discard info in Class
            features = features.split(info['archetypeFlavorName'])[0]
            features = features.split('#')
            # remove the unnecessary '_' symbols and leading / trailing whitespace
            features[:] = [x.replace('_', '').strip() for x in features]
            # remove empty entries
            features[:] = [x for x in features if x]
            # create the dict that is going to be returned
            feature_dict = {}
            prev_index = 0
            for feature in features:
                splitted = feature.split('\r\n', 1)
                splitted = [splitted[0].strip(), splitted[1].strip()]
                # if this feature is one of our 'main' features, let's add it to the dictionary
                if splitted[0] in features_list:
                    prev_index = features_list.index(splitted[0])
                    feature_dict[splitted[0]] = splitted[1]
                # if it is not, then it means it's a part of some other feature, so let's add the text
                # into the previous 'main' feature we handled
                else:
                    prev_feature = features_list[prev_index]
                    feature_dict[prev_feature] += '\n\n{}\n{}'.format(
                        splitted[0], splitted[1])
            info.pop('classFeatureText', None)
            info.pop('classFeatureText2', None)
            info['features'] = feature_dict
        # aka if we're working with Archetypes
        elif 'leveledTable' in info.keys():
            features = info['text'].split('\r')
            if info['text2']:
                features += info['text2']
            for index, feature in enumerate(features):
                if '\n## ' in feature:
                    working_index = len(features)
                    del features[index:working_index]
                    break
            features_list = [x.strip('\n###').strip()
                             for x in features if '\n### ' in x]
            # now that we have the features list, let's approach the problem exactly like in Class
            features = info['text']
            if info['text2']:
                features += info['text2']
            features = features.split('\n## ', 1)[0]
            features = features.split('#')
            features[:] = [x.replace('_', '').strip() for x in features]
            features[:] = [x for x in features if x]
            info['description'] = features[0].strip()
            del features[0]
            feature_dict = {}
            for feature in features:
                splitted = feature.split('\r\n', 1)
                if len(splitted) == 1:
                    continue
                splitted = [splitted[0].strip(), splitted[1].strip()]
                if splitted[0] in features_list:
                    prev_index = features_list.index(splitted[0])
                    feature_dict[splitted[0]] = splitted[1]
                else:
                    prev_feature = features_list[prev_index]
                    feature_dict[prev_feature] += '\n\n{}\n{}'.format(
                        splitted[0], splitted[1])
            info.pop('text', None)
            info.pop('text2', None)
            info['features'] = feature_dict
            info['featuresTable'] = {}
            for feature, desc in info['features'].items():
                level = [strip(s)
                         for s in desc.split() if strip(s).isdigit()]
                level = level[0] if len(level) > 0 else '3'
                if level in info['featuresTable'].keys():
                    info['featuresTable'][str(level)] += f', {feature}'
                else:
                    info['featuresTable'][str(level)] = feature
        if info['name'] == 'Guardian':
            fix = info['features']['Cleansing Touch'].split('\n\n', 1)
            info['features']['Cleansing Touch'] = fix[0]
            info['features']['Guardian Aura'] += '\n\n' + fix[1]
        relevant_info.append(info)
    return relevant_info


def update():
    """Fetches all files from the API. If the correct folder is not created yet,
    it creates it. It will always sleep for the amount of time it took to download
    the file (just to be mindful of the website traffic). This function will only
    be used on the server and should probably be executed every week or so."""

    if not os.path.isdir('./json'):
        os.mkdir('json')
    for item in get_targets():
        result = dump_to_json(item)
        seconds = result.elapsed.total_seconds()
        if result.ok:
            print(f"Sleeping for {seconds} seconds")
            sleep(seconds)
        print('Done sleeping\n')


def find(data_type, **kwargs):
    """Finds elements of the specified data type (a target from get_targets()) that
    match criteria given in kwargs. If no criteria are given, it returns everything
    from that file."""

    if len(kwargs) == 0:
        return find(data_type, name='')
    with open(f'./json/{data_type}.json', 'r') as f:
        file_content = json.load(f)
    results = []
    for key, value in kwargs.items():
        if isinstance(value, str):
            value = value.lower()
            for result in file_content:
                value_from_key = json.dumps(result[key], ensure_ascii=False)
                if value in value_from_key.lower():
                    results.append(result)
        elif isinstance(value, list):
            for member in value:
                member = member.lower()
                for result in file_content:
                    value_from_key = json.dumps(
                        result[key], ensure_ascii=False)
                    if member in value_from_key.lower():
                        results.append(result)
    return results


def find_exactly(data_type, **kwargs):
    """Finds element of the specified data type (a target from get_targets()) that
    matches the criteria given in kwargs. If no criteria are given, it returns the first
    element in that file. The values in kwargs have to match content of the element
    EXACTLY for it to be returned."""

    if len(kwargs) == 0:
        return find(data_type, name='')
    with open(f'./json/{data_type}.json', 'r') as f:
        file_content = json.load(f)
    for key, value in kwargs.items():
        if isinstance(value, str):
            value = value.lower()
            for result in file_content:
                value_from_key = json.dumps(result[key], ensure_ascii=False)
                if value == value_from_key.lower().strip('"').strip():
                    return result
    return None


if __name__ == "__main__":
    update()
