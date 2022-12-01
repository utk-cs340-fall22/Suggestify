#!/bin/bash

mananNetid="mpatel65"
zacNetid="zperry4"
riyaNetid="rpatel90"
tulsiNetid="ttulsi01"
christianNetid="cgraha37"

mananGithub="mpatel65"
zacGithub="zperry4"
zac="Zac"
perry="Perry"
riyaGithub="rpatel90"
tulsiGithub="tulsitailor"
christianGithub="Christian"
graham="Graham"

# # Manan
# for FILE in *.html *.css *.js README.md
# do
#   git blame --since=2.weeks -w $FILE | grep "$mananGithub" >> sprint4/$mananNetid.commits.txt
# done

# # Zac
# for FILE in *.html *.css *.js README.md
# do
#   git blame --since=2.weeks -w $FILE | grep "$zacGithub" >> sprint4/$zacNetid.commits.txt
# done

# for FILE in *.html *.css *.js README.md
# do
#   git blame --since=2.weeks -w $FILE | grep -e "$zac" -e "$perry" >> sprint4/$zacNetid.commits.txt
# done

# # Riya
# for FILE in *.html *.css *.js README.md
# do
#   git blame --since=2.weeks -w $FILE | grep "$riyaGithub" >> sprint4/$riyaNetid.commits.txt
# done

# Tulsi
# for FILE in *.html *.css *.js README.md
# do
#   git blame --since=2.weeks -w $FILE | grep "$tulsiGithub" >> sprint4/$tulsiNetid.commits.txt
# done

# # Christian
 for FILE in *.html *.css *.js README.md
 do
 git blame --since=2.weeks -w $FILE | grep -e "$christianGithub" -e "$graham" >> sprint4/$christianNetid.commits.txt
done
