#!groovy

@Library('Divorce') _

buildNode {
  checkoutRepo()

  try {
    make 'install', name: 'Install dev dependencies'
    make 'test-nsp', name: 'Security'

    stage('Unit test and coverage') {
     sh 'yarn test-coverage' 
    }
    
    stage('Sonar scanner') {
      onPR {
        sh 'yarn sonar-scanner -Dsonar.analysis.mode=preview -Dsonar.host.url=$SONARQUBE_URL'
      }

      onMaster {
       sh 'yarn sonar-scanner -Dsonar.host.url=$SONARQUBE_URL'
      }
    }

  } finally {
    sh 'docker-compose run dev rm -rf coverage'
    sh 'docker-compose run dev rm -rf .sonar'
    make 'clean'
  }

  onPR {
    enforceVersionBump()
  }

  onMaster {
    publishNodePackage()
  }
}
