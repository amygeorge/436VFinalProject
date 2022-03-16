import pandas as pd

column_mapping = {
# 1) age
    'QN1': 'age',
# 2) race
    'QN5E': 'race', # QN5E: White: What race or races do you consider yourself to be?
# 3) sex
    'QN2': 'sex',
# 4) has used tobacco
    'QN6': 'used_e-cigarette', # QN6: Have you ever used an e-cigarette, even once or twice?
    'QN44': 'used_chewing-tobacco,snuff,dip', # QN44: Have you ever used chewing tobacco, snuff, or dip, even just a small amount?
    'QN56': 'used_heated-tobacco-product', # QN56: Have you ever used a 'heated tobacco product', even just one time?
# 5) household exposure
    'Q114A': 'household_exposure_cigarette', # Q114A: Smoke cigarettes: Does anyone who lives with you now...?
    'Q114B': 'household_exposure_cigar,cigarillo,little-cigar', # Q114B: Smoke cigars, cigarillos, or little cigars: Does anyone who lives with you now...? (Select one or more)
    'Q114C': 'household_exposure_chewing-tobacco,snuff,dipcigarette', # Q114C: Use chewing tobacco, snuff, or dip: Does anyone who lives with you now...?
    'Q114D': 'household_exposure_e-cigarette', # Q114A: Smoke e-cigarettes: Does anyone who lives with you now...?
    'Q114E': 'household_exposure_hookah,waterpipe', # Q114E: Smoke tobacco in a hookah or waterpipe: Does anyone who lives with you now...?
    'Q114F': 'household_exposure_pipe-filled-with-tobacco-not-hookah', # Q114F: Smoke pipes filled with tobacco (not hookah or waterpipes): Does anyone who lives with you now...?
    'Q114G': 'household_exposure_dissolvable-tobacco-product:', # Q114G: Use snus: Does anyone who lives with you now...?
    'Q114I': 'household_exposure_bidi', # Q114I: Smoke bidis (small brown cigarettes wrapped in a leaf): Does anyone who lives with you now...?
    'Q114J': 'household_exposure_heated-tobacco-product', # Q114J: Use heated tobacco products: Does anyone who lives with you now...?
    'Q114K': 'household_exposure_None', # Q114K: No one who lives with me now uses any form of tobacco: Does anyone who lives with you now...?
# 6) start age
    'QN7': 'start_age_e-cigarette', # QN7: How old were you when you first used an e-cigarette, even once or twice?
    'Q23': 'start_age_cigarette', # Q23: How old were you when you first smoked a cigarette, even one or two puffs?
    'Q36': 'start_age_cigar,cigarillo,little-cigar', # : How old were you when you first smoked a cigar, cigarillo, or little cigar, even one or two puffs?
    'Q45': 'start_age_chewing-tobacco,snuff,dip', # Q45: How old were you when you first used chewing tobacco, snuff, or dip, even just a small amount?
    'Q49': 'start_age_hookah,waterpipe', # Q49: How old were you when you first smoked tobacco in a hookah or waterpipe, even one or two puffs?
# 8) quit for good
    'Q64': 'quit_for_good', #Q64: During the past 12 months, how many times have you stopped using all tobacco products for one day or longer because you were trying to quit all tobacco products for good?
# 9) harm perception: occasional
    'Q83': 'harm_occasional_cigarettes', # Q83: How much do you think people harm themselves when they smoke cigarettes some days but not every day?
    'Q84': 'harm_occasional_cigar,cigarillo,little-cigar', # Q84: How much do you think people harm themselves when they smoke cigars, cigarillos, or little cigars some days but not every day?
    'Q86': 'harm_occasional_chewing-tobacco,snuff,dip,snus,dissolvable-tobacco-product', # Q86: How much do you think people harm themselves when they use chewing tobacco, snuff, dip, snus, or dissolvable tobacco products some days but not every day?
    'Q88': 'harm_occasional_e-cigarettes', # Q88: How much do you think people harm themselves when they use e-cigarettes some days but not every day?
    'Q90': 'harm_occasional_hookah,waterpipe', # Q90: How much do you think people harm themselves when they smoke tobacco in a hookah or waterpipe some days but not every day?
# 10) harm perception: low nicotine
    'Q92': 'harm_low_nicotine', # Q92: Compared to a typical cigarette, would you think that a cigarette advertised as low nicotine would be…?
# 11) harm perception: addictiveness
    'Q85': 'harm_addictiveness_cigar,cigarillo,little-cigar', # Q85: Do you believe that cigars, cigarillos, or little cigars are (LESS ADDICTIVE, EQUALLY ADDICTIVE, or MORE ADDICTIVE) than cigarettes?
    'Q87': 'harm_addictiveness_chewing-tobacco,snuff,dip,snus,dissolvable-tobacco-product', # Q87: Do you believe that chewing tobacco, snuff, dip, snus, or dissolvable tobacco products are (LESS ADDICTIVE, EQUALLY ADDICTIVE, or MORE ADDICTIVE) than cigarettes?
    'Q89': 'harm_addictiveness_e-cigarette', # Q89: Do you believe that e-cigarettes are (LESS ADDICTIVE, EQUALLY ADDICTIVE, or MORE ADDICTIVE) than cigarettes?
    'Q91': 'harm_addictiveness_hookah,waterpipe', # Q91: Do you believe that smoking tobacco in a hookah or waterpipe is (LESS ADDICTIVE, EQUALLY ADDICTIVE, or MORE ADDICTIVE) than cigarettes?
# 12) e-cigarettes popularity
    'Q97': 'popularity_e-cigarette', # Q97: Out of every 10 students in your grade at school, how many do you think use e-cigarettes?
# 13) cigarettes popularity
    'Q96': 'popularity_cigarette', # Q96: Out of every 10 students in your grade at school, how many do you think smoke cigarettes?
# 14) e-cigarettes motivation
    'Q16A': 'motivation_friend', # Q16A: A friend used them: What are the reasons that you have used e-cigarettes?
    'Q16B': 'motivation_family-member', # Q16B: A family member used them: What are the reasons that you have used e-cigarettes?
    'Q16C': 'motivation_quit-other', # Q16C: To try to quit using other tobacco products, such as cigarettes: What are the reasons that you have used e-cigarettes?
    'Q16D': 'motivation_cost', # Q16D: They cost less than other tobacco products, such as cigarettes: What are the reasons that you have used e-cigarettes?
    'Q16E': 'motivation_ease-of-access', # Q16E: They are easier to get than other tobacco products, such as cigarettes: What are the reasons that you have used e-cigarettes?
    'Q16F': 'motivation_media-influence', # Q16F: I've seen people on TV, online, or in movies use them: What are the reasons that you have used e-cigarettes?
    'Q16G': 'motivation_less-harmful', # Q16G: They are less harmful than other forms of tobacco, such as cigarettes: What are the reasons that you have used e-cigarettes?
    'Q16H': 'motivation_flavors-availability', # Q16H: They are available in flavors, such as mint, candy, fruit, or chocolate: What are the reasons that you have used e-cigarettes?
    'Q16I': 'motivation_obscurity', # Q16I: I can use them unnoticed at home or at school: What are the reasons that you have used e-cigarettes?
    'Q16J': 'motivation_tricks', # Q16J: I can use them to do tricks: What are the reasons that you have used e-cigarettes?
    'Q16K': 'motivation_curiosity', # Q16K: I was curious about them: What are the reasons that you have used e-cigarettes?
    'Q16L': 'motivation_other', # Q16L: I used them for some other reason: What are the reasons that you have used e-cigarettes?
# 15) ease at store
    'Q72': 'ease_store', # Q72: How easy do you think it is for people your age to buy tobacco products in a store?
# 16) ease online
    'Q73': 'ease_online', # Q73: How easy do you think it is for people your age to buy tobacco products online?
# 17) internet ads
    'Q98': 'ads_non-e-cigarette_internet', # Q98: When you are using the Internet, how often do you see ads or promotions for cigarettes or other tobacco products?
    'Q102': 'ads_e-cigarette_internet', # Q102: When you are using the Internet, how often do you see ads or promotions for e-cigarettes?
# 18) social media ads
    'Q106': 'ads_e-cigarette_social-media', # Q106: How often do you see posts related to e-cigarettes when you go on social media (such as YouTube, Instagram, Snapchat, Twitter, or Facebook)?
}
# TODO: RACE: differentiate non-white and undefined/prefer not to say answers
# TODO: USED: remove rows with undefined/prefer not to say answers?
# TODO: START_AGE: earliest start age for all categories (e.g. if started e-cig earliest then use e-cig start age)
# TODO: remove nrows (just testing with 5 rows for now)

raw_data = pd.read_csv('../data/nyts2020.csv', nrows=5, usecols=list(column_mapping.keys()))
data = raw_data.rename(column_mapping, axis=1)
# print('raw data', raw_data)
# print('data', data)

data.to_csv('../data/nyts2020_processed.csv', encoding='utf-8', index=False)
